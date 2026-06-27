import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/search?q=query&limit=10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20);

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
        brand: {
          select: { name: true },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const transformed = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice.toNumber(),
      image: product.images[0]?.url || null,
      brand: product.brand?.name || null,
    }));

    return NextResponse.json({ products: transformed });
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}