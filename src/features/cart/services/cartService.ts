import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    inStock: boolean;
  };
  variant: {
    id: string;
    sku: string | null;
    options: Record<string, string>;
    price: number | null;
    image: string | null;
  } | null;
  subtotal: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  coupon: {
    code: string;
    type: string;
    value: number;
  } | null;
  summary: CartSummary;
}

class CartService {
  // Get or create cart
  async getCart(customerId?: string, sessionId?: string): Promise<Cart | null> {
    const where = customerId 
      ? { customerId } 
      : sessionId 
        ? { sessionId } 
        : null;

    if (!where) return null;

    const cart = await prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            variant: true,
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        coupon: true,
      },
    });

    if (!cart) return null;

    return this.transformCart(cart);
  }

  // Transform cart to response format
  private async transformCart(cart: any): Promise<Cart> {
    const items: CartItem[] = cart.items.map((item: any) => {
      const primaryImage = item.product.images[0];
      
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price.toNumber(),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: primaryImage?.url || null,
          inStock: item.variant 
            ? item.variant.inventoryQuantity > 0 
            : true,
        },
        variant: item.variant ? {
          id: item.variant.id,
          sku: item.variant.sku,
          options: item.variant.options as Record<string, string>,
          price: item.variant.price?.toNumber() || null,
          image: item.variant.imageUrl,
        } : null,
        subtotal: item.price.toNumber() * item.quantity,
      };
    });

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate discount
    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'percentage') {
        discount = subtotal * (cart.coupon.value.toNumber() / 100);
        if (cart.coupon.maxDiscountAmount) {
          discount = Math.min(discount, cart.coupon.maxDiscountAmount.toNumber());
        }
      } else if (cart.coupon.type === 'fixed_amount') {
        discount = Math.min(cart.coupon.value.toNumber(), subtotal);
      } else if (cart.coupon.type === 'free_shipping') {
        // Discount applied to shipping
        discount = 0;
      }
    }

    // Calculate shipping
    let shipping = 100; // Default
    if (subtotal >= 2000) {
      shipping = 0;
    }
    if (cart.coupon?.type === 'free_shipping') {
      shipping = 0;
      discount = 0; // Don't double discount
    }

    // Calculate tax
    const taxableAmount = subtotal - discount;
    const taxRate = 0.075; // 7.5%
    const tax = taxableAmount * taxRate;

    // Total
    const total = taxableAmount + shipping + tax;

    return {
      id: cart.id,
      items,
      coupon: cart.coupon ? {
        code: cart.coupon.code,
        type: cart.coupon.type,
        value: cart.coupon.value.toNumber(),
      } : null,
      summary: {
        subtotal,
        discount,
        shipping,
        tax,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    };
  }

  // Add item to cart
  async addItem(
    customerId: string | null,
    sessionId: string,
    productId: string,
    variantId: string | null,
    quantity: number = 1
  ): Promise<Cart> {
    // Get product price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { basePrice: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Get variant price if applicable
    let price = product.basePrice;
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { price: true },
      });
      if (variant?.price) {
        price = variant.price;
      }
    }

    // Find or create cart
    const where = customerId ? { customerId } : { sessionId };
    let cart = await prisma.cart.findFirst({ where });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          customerId: customerId || null,
          sessionId: customerId ? null : sessionId,
        },
      });
    }

    // Check for existing item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          price,
        },
      });
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: true,
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
        coupon: true,
      },
    });

    return this.transformCart(updatedCart!);
  }

  // Update cart item quantity
  async updateItemQuantity(
    customerId: string | null,
    sessionId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart | null> {
    // Find cart
    const where = customerId ? { customerId } : { sessionId };
    const cart = await prisma.cart.findFirst({
      where,
      include: { items: { where: { id: itemId } } },
    });

    if (!cart || cart.items.length === 0) {
      return null;
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(customerId || undefined, customerId ? undefined : sessionId);
  }

  // Remove item from cart
  async removeItem(
    customerId: string | null,
    sessionId: string,
    itemId: string
  ): Promise<Cart | null> {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(customerId || undefined, customerId ? undefined : sessionId);
  }

  // Apply coupon
  async applyCoupon(
    customerId: string | null,
    sessionId: string,
    couponCode: string
  ): Promise<Cart | null> {
    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Validate coupon
    const now = new Date();
    if (!coupon.isActive) {
      throw new Error('Coupon is no longer active');
    }
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new Error('Coupon is not yet valid');
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new Error('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    // Find cart
    const where = customerId ? { customerId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });

    if (!cart) {
      return null;
    }

    // Apply coupon
    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id },
    });

    return this.getCart(customerId || undefined, customerId ? undefined : sessionId);
  }

  // Remove coupon
  async removeCoupon(
    customerId: string | null,
    sessionId: string
  ): Promise<Cart | null> {
    const where = customerId ? { customerId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });

    if (!cart) {
      return null;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: null },
    });

    return this.getCart(customerId || undefined, customerId ? undefined : sessionId);
  }

  // Clear cart
  async clearCart(
    customerId: string | null,
    sessionId: string
  ): Promise<void> {
    const where = customerId ? { customerId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({
        where: { id: cart.id },
        data: { couponId: null },
      });
    }
  }

  // Merge guest cart to customer cart
  async mergeGuestCart(guestSessionId: string, customerId: string): Promise<Cart> {
    // Get guest cart
    const guestCart = await prisma.cart.findFirst({
      where: { sessionId: guestSessionId },
      include: {
        items: {
          include: {
            variant: true,
            product: true,
          },
        },
      },
    });

    // Get or create customer cart
    let customerCart = await prisma.cart.findFirst({
      where: { customerId },
      include: { items: true },
    });

    if (!customerCart) {
      customerCart = await prisma.cart.create({
        data: { customerId },
      });
    }

    // Merge items
    for (const guestItem of guestCart?.items || []) {
      const existingItem = customerCart.items.find(
        item => item.productId === guestItem.productId && item.variantId === guestItem.variantId
      );

      if (existingItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        // Add new item
        await prisma.cartItem.create({
          data: {
            cartId: customerCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
            price: guestItem.price,
          },
        });
      }
    }

    // Delete guest cart
    if (guestCart) {
      await prisma.cartItem.deleteMany({ where: { cartId: guestCart.id } });
      await prisma.cart.delete({ where: { id: guestCart.id } });
    }

    return (await this.getCart(customerId))!;
  }
}

export const cartService = new CartService();