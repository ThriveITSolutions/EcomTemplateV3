import { productRepository, type ProductWithRelations, type PaginatedProducts } from '../repositories/productRepository';
import { CreateProduct, UpdateProduct, ProductFilters } from '@/lib/validation/schemas';
import type { Product } from '@prisma/client';

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  brand: { id: string; name: string; slug: string } | null;
  variants: Array<{
    id: string;
    options: Record<string, string>;
    inventoryQuantity: number;
  }>;
  reviewCount: number;
  rating: number;
}

export interface ProductDetail extends ProductCard {
  description: string;
  shortDescription: string | null;
  sku: string | null;
  material: string | null;
  gender: string | null;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  variants: Array<{
    id: string;
    sku: string | null;
    price: number | null;
    options: Record<string, string>;
    inventoryQuantity: number;
    imageUrl: string | null;
  }>;
  isInStock: boolean;
  stockQuantity: number;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    createdAt: Date;
  }>;
}

function transformToProductCard(product: ProductWithRelations): ProductCard {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  
  // Calculate total stock across variants
  const totalStock = product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0);
  
  // Calculate average rating from review count (simplified)
  const rating = product._count && product._count.reviews > 0 ? 4.5 : 0; // Would fetch from reviews

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.basePrice.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() || null,
    image: primaryImage?.url || null,
    brand: product.brand,
    variants: product.variants.map(v => ({
      id: v.id,
      options: v.options as Record<string, string>,
      inventoryQuantity: v.inventoryQuantity,
    })),
    reviewCount: product._count?.reviews || 0,
    rating,
  };
}

function transformToProductDetail(product: ProductWithRelations, reviews: any[] = []): ProductDetail {
  const card = transformToProductCard(product);
  const totalStock = product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0);

  return {
    ...card,
    description: product.description || '',
    shortDescription: product.shortDescription,
    sku: product.sku,
    material: product.material,
    gender: product.gender,
    images: product.images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })),
    categories: product.categories.map(c => ({
      id: c.category.id,
      name: c.category.name,
      slug: c.category.slug,
    })),
    variants: product.variants.map(v => ({
      id: v.id,
      sku: v.sku,
      price: v.price?.toNumber() || null,
      options: v.options as Record<string, string>,
      inventoryQuantity: v.inventoryQuantity,
      imageUrl: (v as any).imageUrl || null,
    })),
    isInStock: totalStock > 0 || product.allowBackorder,
    stockQuantity: totalStock,
    reviews: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      content: r.content,
      createdAt: r.createdAt,
    })),
  };
}

class ProductService {
  // Get products with filters
  async getProducts(filters: ProductFilters): Promise<{
    products: ProductCard[];
    pagination: PaginatedProducts['pagination'];
  }> {
    const result = await productRepository.findAll(filters);
    
    return {
      products: result.products.map(transformToProductCard),
      pagination: result.pagination,
    };
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    const product = await productRepository.findBySlug(slug);
    
    if (!product) return null;

    // Fetch reviews
    // const reviews = await reviewRepository.findByProductId(product.id, 5);
    
    return transformToProductDetail(product, []);
  }

  // Get product by ID
  async getProductById(id: string): Promise<ProductDetail | null> {
    const product = await productRepository.findById(id);
    
    if (!product) return null;

    return transformToProductDetail(product, []);
  }

  // Create product
  async createProduct(data: CreateProduct): Promise<Product> {
    return productRepository.create(data);
  }

  // Update product
  async updateProduct(id: string, data: UpdateProduct): Promise<Product> {
    return productRepository.update(id, data);
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    return productRepository.delete(id);
  }

  // Get featured products
  async getFeaturedProducts(section: string = 'home_featured', limit: number = 8): Promise<ProductCard[]> {
    const products = await productRepository.findFeatured(section, limit);
    return products.map(transformToProductCard);
  }

  // Get new arrivals
  async getNewArrivals(limit: number = 8): Promise<ProductCard[]> {
    const result = await productRepository.findAll({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit,
    });
    
    return result.products.map(transformToProductCard);
  }

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<ProductCard[]> {
    const products = await productRepository.findRelated(productId, limit);
    return products.map(transformToProductCard);
  }

  // Search products (for autocomplete)
  async searchProducts(query: string, limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
  }>> {
    return productRepository.search(query, limit);
  }

  // Get products by category
  async getProductsByCategory(categorySlug: string, filters?: Partial<ProductFilters>): Promise<{
    products: ProductCard[];
    pagination: PaginatedProducts['pagination'];
  }> {
    // Get category ID from slug
    const { prisma } = await import('@/lib/prisma');
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return { products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }

    return this.getProducts({
      categoryId: category.id,
      page: 1,
      limit: 20,
      ...filters,
    } as any);
  }

  // Get products by brand
  async getProductsByBrand(brandSlug: string, filters?: Partial<ProductFilters>): Promise<{
    products: ProductCard[];
    pagination: PaginatedProducts['pagination'];
  }> {
    // Get brand ID from slug
    const { prisma } = await import('@/lib/prisma');
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
    });

    if (!brand) {
      return { products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }

    return this.getProducts({
      brandId: brand.id,
      page: 1,
      limit: 20,
      ...filters,
    } as any);
  }

  // Bulk update products
  async bulkUpdateProducts(ids: string[], data: Partial<UpdateProduct>): Promise<void> {
    await Promise.all(ids.map(id => productRepository.update(id, data as UpdateProduct)));
  }

  // Bulk delete products
  async bulkDeleteProducts(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => productRepository.delete(id)));
  }

  // Get product variants with options
  async getVariantOptions(productId: string): Promise<{
    colors: string[];
    sizes: string[];
    availableCombinations: Array<{ color: string; size: string; variantId: string; stock: number }>;
  }> {
    const product = await productRepository.findById(productId);
    
    if (!product) {
      return { colors: [], sizes: [], availableCombinations: [] };
    }

    const colors = new Set<string>();
    const sizes = new Set<string>();
    const combinations: Array<{ color: string; size: string; variantId: string; stock: number }> = [];

    for (const variant of product.variants) {
      const options = variant.options as Record<string, string>;
      
      if (options.color) colors.add(options.color);
      if (options.size) sizes.add(options.size);
      
      combinations.push({
        color: options.color || '',
        size: options.size || '',
        variantId: variant.id,
        stock: variant.inventoryQuantity,
      });
    }

    return {
      colors: Array.from(colors),
      sizes: Array.from(sizes),
      availableCombinations: combinations,
    };
  }
}

export const productService = new ProductService();