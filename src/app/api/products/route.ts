import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productFiltersSchema } from '@/lib/validation/schemas';

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate filters
    const filters = {
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('category') || undefined,
      brandId: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      gender: searchParams.get('gender') as 'men' | 'women' | 'unisex' | 'kids' | undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
      isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
      sortBy: searchParams.get('sortBy') as 'name' | 'price' | 'createdAt' | undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    // Build where clause
    const where: any = {
      isActive: true,
      isPublished: true,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoryId) {
      where.categories = {
        some: { categoryId: filters.categoryId }
      };
    }

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {};
      if (filters.minPrice !== undefined) {
        where.basePrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.basePrice.lte = filters.maxPrice;
      }
    }

    if (filters.gender) {
      where.gender = filters.gender;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Sorting
    const orderBy: any = {};
    switch (filters.sortBy) {
      case 'name':
        orderBy.name = filters.sortOrder;
        break;
      case 'price':
        orderBy.basePrice = filters.sortOrder;
        break;
      case 'createdAt':
        orderBy.createdAt = filters.sortOrder;
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // Pagination
    const skip = (filters.page - 1) * filters.limit;
    const take = Math.min(filters.limit, 100);

    // Query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          brand: {
            select: { id: true, name: true, slug: true },
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
          variants: {
            select: {
              id: true,
              options: true,
              price: true,
              inventoryQuantity: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / take);

    return NextResponse.json({
      products,
      pagination: {
        page: filters.page,
        limit: take,
        total,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPrevPage: filters.page > 1,
      },
    });
  } catch (error) {
    console.error('Products list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = productFiltersSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      );
    }

    // Create slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        basePrice: body.basePrice,
        compareAtPrice: body.compareAtPrice,
        costPrice: body.costPrice,
        sku: body.sku,
        barcode: body.barcode,
        material: body.material,
        gender: body.gender,
        collection: body.collection,
        season: body.season,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        isPublished: body.isPublished ?? true,
        trackInventory: body.trackInventory ?? true,
        allowBackorder: body.allowBackorder ?? false,
        lowStockThreshold: body.lowStockThreshold ?? 5,
        weight: body.weight,
        dimensions: body.dimensions,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        tags: body.tags || [],
        brandId: body.brandId,
        
        // Handle categories
        categories: body.categoryIds ? {
          create: body.categoryIds.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
          })),
        } : undefined,

        // Handle variants
        variants: body.variants ? {
          create: body.variants.map((variant: any) => ({
            sku: variant.sku,
            barcode: variant.barcode,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            inventoryQuantity: variant.inventoryQuantity ?? 0,
            options: variant.options || {},
            imageUrl: variant.imageUrl,
            weight: variant.weight,
          })),
        } : undefined,

        // Handle images
        images: body.images ? {
          create: body.images.map((image: any, index: number) => ({
            url: image.url,
            alt: image.alt,
            position: image.position ?? index,
            isPrimary: image.isPrimary ?? index === 0,
          })),
        } : undefined,
      },
      include: {
        images: true,
        brand: true,
        categories: {
          include: { category: true },
        },
        variants: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}