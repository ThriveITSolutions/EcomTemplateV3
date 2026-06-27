import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createReviewSchema } from '@/lib/validation/schemas';

// GET /api/reviews - List reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const approvedOnly = searchParams.get('approved') !== 'false';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const where: any = { productId };
    if (approvedOnly) {
      where.isApproved = true;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Transform reviews
    const transformed = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      images: review.images,
      helpfulCount: review.helpfulCount,
      isFeatured: review.isFeatured,
      createdAt: review.createdAt,
      customer: {
        name: `${review.customer.user.firstName || ''} ${review.customer.user.lastName || ''}`.trim() || 'Anonymous',
      },
    }));

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId, isApproved: true },
      _count: true,
    });

    const distribution = [1, 2, 3, 4, 5].map(rating => {
      const found = ratingDistribution.find(r => r.rating === rating);
      return {
        rating,
        count: found?._count || 0,
        percentage: total > 0 ? Math.round(((found?._count || 0) / total) * 100) : 0,
      };
    }).reverse();

    return NextResponse.json({
      reviews: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error('Reviews list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = createReviewSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      );
    }

    // Get customer from header (set by auth middleware)
    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Authentication required to submit reviews' },
        { status: 401 }
      );
    }

    // Check if customer already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId: body.productId, customerId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review (defaults to not approved)
    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        customerId,
        rating: body.rating,
        title: body.title,
        content: body.content,
        images: body.images || [],
        isApproved: false, // Requires moderation
        isFeatured: false,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}