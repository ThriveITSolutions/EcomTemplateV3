import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/cart/items/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ success: true, removed: true });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
        variant: true,
      },
    });

    // Calculate new cart summary
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: { include: { product: true } },
        coupon: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.basePrice;
      return sum + (price.toNumber() * item.quantity);
    }, 0);

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

    let shipping = 100;
    if (subtotal >= 2000) shipping = 0;

    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.075;
    const total = taxableAmount + shipping + tax;

    return NextResponse.json({
      item: {
        id: updatedItem.id,
        quantity: updatedItem.quantity,
        price: updatedItem.price.toNumber(),
        product: updatedItem.product,
        variant: updatedItem.variant,
      },
      cartSummary: {
        subtotal,
        discount,
        shipping,
        tax,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    await prisma.cartItem.delete({ where: { id } });

    // Recalculate cart summary
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: { include: { product: true } },
        coupon: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ success: true, cartSummary: null });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.basePrice;
      return sum + (price.toNumber() * item.quantity);
    }, 0);

    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'percentage') {
        discount = subtotal * (cart.coupon.value.toNumber() / 100);
      } else if (cart.coupon.type === 'fixed_amount') {
        discount = cart.coupon.value.toNumber();
      }
    }

    let shipping = 100;
    if (subtotal >= 2000) shipping = 0;

    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.075;
    const total = taxableAmount + shipping + tax;

    return NextResponse.json({
      success: true,
      cartSummary: {
        subtotal,
        discount,
        shipping,
        tax,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}