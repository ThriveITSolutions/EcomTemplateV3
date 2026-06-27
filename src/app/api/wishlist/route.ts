import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const customerId = request.headers.get('x-customer-id');

    if (!customerId) {
      return NextResponse.json({ wishlist: [] });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { customerId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            brand: { select: { id: true, name: true } },
            variants: {
              where: { isActive: true },
              select: { id: true, options: true, inventoryQuantity: true },
            },
          },
        },
        variant: {
          select: { id: true, sku: true, options: true, price: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformed = wishlistItems.map(item => {
      const primaryImage = item.product.images[0];
      const totalStock = item.product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0);

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        createdAt: item.createdAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.basePrice.toNumber(),
          compareAtPrice: item.product.compareAtPrice?.toNumber() || null,
          image: primaryImage?.url || null,
          brand: item.product.brand,
          inStock: totalStock > 0,
          variant: item.variant ? {
            id: item.variant.id,
            sku: item.variant.sku,
            options: item.variant.options,
            price: item.variant.price?.toNumber() || null,
            image: item.variant.imageUrl,
          } : null,
        },
      };
    });

    return NextResponse.json({ wishlist: transformed });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to get wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const customerId = request.headers.get('x-customer-id');
    const body = await request.json();
    const { productId, variantId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: { customerId, productId, variantId: variantId || null },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        customerId,
        productId,
        variantId: variantId || null,
      },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });

    return NextResponse.json({ wishlistItem }, { status: 201 });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const customerId = request.headers.get('x-customer-id');
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    const productId = searchParams.get('productId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!itemId && !productId) {
      return NextResponse.json(
        { error: 'Item ID or Product ID is required' },
        { status: 400 }
      );
    }

    const where: any = { customerId };
    
    if (itemId) {
      where.id = itemId;
    } else if (productId) {
      where.productId = productId;
    }

    await prisma.wishlistItem.deleteMany({ where });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}