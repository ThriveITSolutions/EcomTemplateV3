import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        brand: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        attributes: {
          orderBy: { position: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            customer: {
              include: {
                user: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate total stock
    const totalStock = product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0);

    // Transform response
    const transformed = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      basePrice: product.basePrice.toNumber(),
      compareAtPrice: product.compareAtPrice?.toNumber() || null,
      sku: product.sku,
      barcode: product.barcode,
      material: product.material,
      gender: product.gender,
      collection: product.collection,
      season: product.season,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      trackInventory: product.trackInventory,
      allowBackorder: product.allowBackorder,
      weight: product.weight?.toNumber() || null,
      dimensions: product.dimensions,
      tags: product.tags,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      images: product.images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
      })),
      brand: product.brand,
      categories: product.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
      variants: product.variants.map(v => ({
        id: v.id,
        sku: v.sku,
        barcode: v.barcode,
        price: v.price?.toNumber() || null,
        compareAtPrice: v.compareAtPrice?.toNumber() || null,
        options: v.options,
        inventoryQuantity: v.inventoryQuantity,
        imageUrl: v.imageUrl,
        isActive: v.isActive,
      })),
      attributes: product.attributes.map(attr => ({
        name: attr.name,
        value: attr.value,
      })),
      reviews: product.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        images: r.images,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt,
        customer: {
          name: `${r.customer.user.firstName || ''} ${r.customer.user.lastName || ''}`.trim() || 'Anonymous',
        },
      })),
      reviewCount: product._count.reviews,
      inStock: totalStock > 0 || product.allowBackorder,
      stockQuantity: totalStock,
    };

    return NextResponse.json({ product: transformed });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to get product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { slug },
      data: body,
      include: {
        images: true,
        brand: true,
        categories: { include: { category: true } },
        variants: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Soft delete
    await prisma.product.update({
      where: { slug },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
