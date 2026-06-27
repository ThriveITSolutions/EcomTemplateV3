import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderFiltersSchema, updateOrderStatusSchema } from '@/lib/validation/schemas';

// GET /api/orders - List orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters
    const filters = {
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status'),
      customerId: searchParams.get('customerId') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    // Build where clause
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { user: { email: { contains: filters.search, mode: 'insensitive' } } } },
        { customer: { user: { firstName: { contains: filters.search, mode: 'insensitive' } } } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    // Pagination
    const skip = (filters.page - 1) * filters.limit;
    const take = Math.min(filters.limit, 100);

    // Query
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          customer: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true },
              },
            },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
          coupon: {
            select: { code: true, type: true, value: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    // Transform prices to numbers
    const transformedOrders = orders.map(order => ({
      ...order,
      subtotal: order.subtotal.toNumber(),
      discountAmount: order.discountAmount.toNumber(),
      shippingAmount: order.shippingAmount.toNumber(),
      taxAmount: order.taxAmount.toNumber(),
      totalAmount: order.totalAmount.toNumber(),
      items: order.items.map(item => ({
        ...item,
        price: item.price.toNumber(),
        totalAmount: item.totalAmount.toNumber(),
      })),
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page: filters.page,
        limit: take,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Orders list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      customerId,
      email,
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      shippingMethod,
      paymentMethod,
      paymentProvider,
      customerNotes,
      couponCode,
      isGuest,
    } = body;

    // Get or create cart
    const sessionId = request.cookies.get('guest-id')?.value;
    const cart = await prisma.cart.findFirst({
      where: customerId ? { customerId } : { sessionId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        coupon: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or not found' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price.toNumber() * item.quantity);
    }, 0);

    // Apply coupon
    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'percentage') {
        discount = subtotal * (cart.coupon.value.toNumber() / 100);
        if (cart.coupon.maxDiscountAmount) {
          discount = Math.min(discount, cart.coupon.maxDiscountAmount.toNumber());
        }
      } else if (cart.coupon.type === 'fixed_amount') {
        discount = cart.coupon.value.toNumber();
      }
    }

    // Shipping
    let shipping = 100;
    if (subtotal >= 2000 || shippingMethod === 'free') {
      shipping = 0;
    }

    // Tax
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.075;

    // Total
    const totalAmount = taxableAmount + shipping + tax;

    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    const lastNumber = lastOrder 
      ? parseInt(lastOrder.orderNumber.replace('ORD-', '').replace('-', ''))
      : 0;
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(5, '0')}`;

    // Address object
    const shippingAddress = {
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      country: country || 'BD',
    };

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        
        // Status
        status: 'PENDING',
        paymentStatus: 'PENDING',
        
        // Pricing
        subtotal,
        discountAmount: discount,
        shippingAmount: shipping,
        taxAmount: tax,
        totalAmount,
        
        // Shipping
        shippingMethod,
        
        // Payment
        paymentMethod,
        paymentProvider,
        
        // Coupon
        couponId: cart.couponId,
        
        // Notes
        customerNotes,
        
        // Addresses
        shippingAddress,
        billingAddress: shippingAddress,
        
        // Items
        items: {
          create: cart.items.map(item => ({
            product: { connect: { id: item.productId } },
            ...(item.variantId ? { variant: { connect: { id: item.variantId } } } : {}),
            name: item.product.name,
            sku: item.product.sku,
            price: item.price,
            quantity: item.quantity,
            totalAmount: item.price.toNumber() * item.quantity,
            variantOptions: item.variant?.options,
            variantImage: item.variant?.imageUrl,
          })) as any,
        },
        
        // Analytics
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      include: {
        items: true,
        customer: {
          include: { user: true },
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Update coupon usage
    if (cart.coupon) {
      await prisma.coupon.update({
        where: { id: cart.couponId! },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Update inventory (reserve stock)
    for (const item of cart.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { inventoryQuantity: { decrement: item.quantity } },
        });
      } else {
        // Update main product inventory tracking
        await prisma.inventory.updateMany({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}