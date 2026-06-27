import { prisma } from '@/lib/prisma';
import { Prisma, Product } from '@prisma/client';
import { CreateProduct, UpdateProduct, ProductFilters } from '@/lib/validation/schemas';

export interface ProductWithRelations extends Product {
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    position: number;
    isPrimary: boolean;
  }>;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  variants: Array<{
    id: string;
    sku: string | null;
    price: Prisma.Decimal | null;
    options: Prisma.JsonValue;
    inventoryQuantity: number;
  }>;
  _count?: {
    reviews: number;
  };
}

export interface PaginatedProducts {
  products: ProductWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class ProductRepository {
  // Find product by ID
  async findById(id: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } },
        brand: { select: { id: true, name: true, slug: true } },
        categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
        variants: { select: { id: true, sku: true, price: true, options: true, inventoryQuantity: true } },
        _count: { select: { reviews: true } },
      },
    }) as Promise<ProductWithRelations | null>;
  }

  // Find product by slug
  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        brand: { select: { id: true, name: true, slug: true } },
        categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
        variants: { 
          select: { 
            id: true, 
            sku: true, 
            price: true, 
            options: true, 
            inventoryQuantity: true,
            imageUrl: true,
            isActive: true,
          },
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          select: { id: true, rating: true, title: true, content: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: { select: { reviews: true } },
      },
    }) as Promise<ProductWithRelations | null>;
  }

  // Find products with filters and pagination
  async findAll(filters: ProductFilters): Promise<PaginatedProducts> {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
    };

    // Search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (filters.categoryId) {
      where.categories = { some: { categoryId: filters.categoryId } };
    }

    // Brand filter
    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {};
      if (filters.minPrice !== undefined) {
        where.basePrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.basePrice.lte = filters.maxPrice;
      }
    }

    // Gender
    if (filters.gender) {
      where.gender = filters.gender;
    }

    // Featured
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // In stock filter (check variants or main inventory)
    if (filters.inStock !== undefined) {
      where.variants = filters.inStock 
        ? { some: { inventoryQuantity: { gt: 0 }, isActive: true } }
        : { none: { inventoryQuantity: { gt: 0 }, isActive: true } };
    }

    // Sorting
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (filters.sortBy) {
      case 'name':
        orderBy.name = filters.sortOrder || 'asc';
        break;
      case 'price':
        orderBy.basePrice = filters.sortOrder || 'desc';
        break;
      case 'bestSelling':
        // Would need to join with order items - for now just use createdAt
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // Pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          brand: { select: { id: true, name: true, slug: true } },
          categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
          variants: { 
            select: { id: true, options: true, price: true, inventoryQuantity: true },
            where: { isActive: true },
            take: 5,
          },
          _count: { select: { reviews: true } },
        },
      }) as Promise<ProductWithRelations[]>,
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // Create product
  async create(data: CreateProduct): Promise<Product> {
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice,
        costPrice: data.costPrice,
        sku: data.sku,
        barcode: data.barcode,
        material: data.material,
        gender: data.gender,
        collection: data.collection,
        season: data.season,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
        trackInventory: data.trackInventory ?? true,
        allowBackorder: data.allowBackorder ?? false,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        weight: data.weight,
        dimensions: data.dimensions,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
        brandId: data.brandId,
        
        categories: data.categoryIds ? {
          create: data.categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } },
          })),
        } : undefined,

        variants: data.variants ? {
          create: data.variants.map(variant => ({
            sku: variant.sku,
            barcode: variant.barcode,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            inventoryQuantity: variant.inventoryQuantity ?? 0,
            options: variant.options,
            imageUrl: variant.imageUrl,
            weight: variant.weight,
          })),
        } : undefined,

        images: data.images ? {
          create: data.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            position: image.position ?? index,
            isPrimary: image.isPrimary ?? index === 0,
          })),
        } : undefined,
      },
    });
  }

  // Update product
  async update(id: string, data: UpdateProduct): Promise<Product> {
    const updateData: any = { ...data };

    // Handle categories
    if (data.categoryIds !== undefined) {
      updateData.categories = {
        deleteMany: {},
        create: data.categoryIds.map(categoryId => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    // Handle variants
    if (data.variants !== undefined) {
      // Delete existing variants and create new ones
      updateData.variants = {
        deleteMany: {},
        create: data.variants.map(variant => ({
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          inventoryQuantity: variant.inventoryQuantity ?? 0,
          options: variant.options,
          imageUrl: variant.imageUrl,
          weight: variant.weight,
        })),
      };
    }

    // Handle images
    if (data.images !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: data.images.map((image, index) => ({
          url: image.url,
          alt: image.alt,
          position: image.position ?? index,
          isPrimary: image.isPrimary ?? index === 0,
        })),
      };
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete product (soft delete by setting isActive to false)
  async delete(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Hard delete (use with caution)
  async hardDelete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  // Get featured products
  async findFeatured(section: string = 'home_featured', limit: number = 8): Promise<ProductWithRelations[]> {
    const now = new Date();
    
    return prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        isFeatured: true,
        featuredProducts: {
          some: {
            section,
            isActive: true,
            OR: [
              { startsAt: null },
              { startsAt: { lte: now } },
            ],
            AND: [
              {
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gte: now } },
                ],
              },
            ],
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: { select: { id: true, name: true, slug: true } },
        variants: { 
          select: { id: true, options: true, price: true, inventoryQuantity: true },
          where: { isActive: true },
          take: 5,
        },
      },
    }) as Promise<ProductWithRelations[]>;
  }

  // Get related products
  async findRelated(productId: string, limit: number = 4): Promise<ProductWithRelations[]> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { brandId: true, categories: { select: { categoryId: true } } },
    });

    if (!product) return [];

    return prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        isPublished: true,
        OR: [
          { brandId: product.brandId || undefined },
          { categories: { some: { categoryId: { in: product.categories.map(c => c.categoryId) } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: { select: { id: true, name: true, slug: true } },
        variants: { 
          select: { id: true, options: true, price: true, inventoryQuantity: true },
          where: { isActive: true },
          take: 5,
        },
      },
    }) as Promise<ProductWithRelations[]>;
  }

  // Search products
  async search(query: string, limit: number = 10): Promise<Array<{ id: string; name: string; slug: string; image: string | null }>> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
      take: limit,
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url || null,
    }));
  }
}

export const productRepository = new ProductRepository();