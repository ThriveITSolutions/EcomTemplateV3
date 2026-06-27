import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from '@/lib/validation/schemas';

// GET /api/coupons - List coupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';
    const publicOnly = searchParams.get('public') === 'true';

    const where: any = {};
    
    if (activeOnly) {
      const now = new Date();
      where.isActive = true;
      where.AND = [
        {
          OR: [
            { startsAt: null },
            { startsAt: { lte: now } },
          ],
        },
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: now } },
          ],
        },
      ];
    }
    
    if (publicOnly) {
      where.isPublic = true;
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const transformed = coupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toNumber(),
      minOrderAmount: coupon.minOrderAmount?.toNumber() || null,
      maxDiscountAmount: coupon.maxDiscountAmount?.toNumber() || null,
      usageLimit: coupon.usageLimit,
      usageCount: coupon.usageCount,
      perCustomerLimit: coupon.perCustomerLimit,
      startsAt: coupon.startsAt,
      expiresAt: coupon.expiresAt,
      isActive: coupon.isActive,
      isPublic: coupon.isPublic,
      description: coupon.description,
    }));

    return NextResponse.json({ coupons: transformed });
  } catch (error) {
    console.error('Coupons list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Validate coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate schema
    const validated = validateCouponSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { code, orderTotal } = body;

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 200 }
      );
    }

    // Validate coupon
    const now = new Date();

    // Check if active
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: 'This coupon is no longer active' },
        { status: 200 }
      );
    }

    // Check start date
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json(
        { valid: false, error: 'This coupon is not yet valid' },
        { status: 200 }
      );
    }

    // Check expiry
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has expired' },
        { status: 200 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has reached its usage limit' },
        { status: 200 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount.toNumber()) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of ৳${coupon.minOrderAmount.toNumber().toLocaleString()} required`,
      }, { status: 200 });
    }

    // Calculate discount
    let discount = 0;
    let discountText = '';

    switch (coupon.type) {
      case 'percentage':
        discount = orderTotal * (coupon.value.toNumber() / 100);
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, coupon.maxDiscountAmount.toNumber());
        }
        discountText = `${coupon.value.toNumber()}% off`;
        break;
      
      case 'fixed_amount':
        discount = Math.min(coupon.value.toNumber(), orderTotal);
        discountText = `৳${coupon.value.toNumber()} off`;
        break;
      
      case 'free_shipping':
        discountText = 'Free shipping';
        break;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toNumber(),
        discount,
        discountText,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// PUT /api/coupons - Create or update coupon (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = createCouponSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      );
    }

    const { id, ...data } = body;

    // Normalize code
    data.code = data.code.toUpperCase();

    // Parse dates
    if (data.startsAt) data.startsAt = new Date(data.startsAt);
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);

    let coupon;
    if (id) {
      // Update existing
      coupon = await prisma.coupon.update({
        where: { id },
        data,
      });
    } else {
      // Create new
      coupon = await prisma.coupon.create({
        data: {
          code: data.code,
          type: data.type,
          value: data.value,
          minOrderAmount: data.minOrderAmount,
          maxDiscountAmount: data.maxDiscountAmount,
          usageLimit: data.usageLimit,
          perCustomerLimit: data.perCustomerLimit || 1,
          startsAt: data.startsAt || new Date(),
          expiresAt: data.expiresAt,
          isActive: data.isActive ?? true,
          isPublic: data.isPublic ?? true,
          applicableProducts: data.applicableProducts || [],
          applicableCategories: data.applicableCategories || [],
          description: data.description,
        },
      });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}