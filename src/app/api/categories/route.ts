import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCategorySchema, updateCategorySchema } from '@/lib/validation/schemas';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const where: any = {
      isActive: true,
    };

    if (parentOnly) {
      where.parentId = null;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: includeProducts ? {
          select: { products: true },
        } : undefined,
      },
    });

    // Transform response
    const transformed = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parentId: cat.parentId,
      level: cat.level,
      path: cat.path,
      productCount: cat._count?.products || 0,
      children: cat.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        image: child.image,
      })),
    }));

    return NextResponse.json({ categories: transformed });
  } catch (error) {
    console.error('Categories list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = createCategorySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Handle parent category
    let level = 0;
    let path = slug;
    
    if (body.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: body.parentId },
      });
      
      if (parent) {
        level = parent.level + 1;
        path = `${parent.path}/${slug}`;
      }
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        image: body.image,
        parentId: body.parentId,
        level,
        path,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}