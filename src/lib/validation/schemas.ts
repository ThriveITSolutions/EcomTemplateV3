import { z } from 'zod';

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  basePrice: z.coerce.number().positive('Price must be positive'),
  compareAtPrice: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().positive().optional(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  material: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']).optional(),
  collection: z.string().optional(),
  season: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  brandId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  lowStockThreshold: z.number().int().positive().default(5),
  weight: z.coerce.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    barcode: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    compareAtPrice: z.coerce.number().positive().optional(),
    inventoryQuantity: z.number().int().min(0).default(0),
    options: z.record(z.string()),
    imageUrl: z.string().url().optional(),
    weight: z.coerce.number().positive().optional(),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).default(0),
    isPrimary: z.boolean().default(false),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']).optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt', 'bestSelling']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================================
// CATEGORY SCHEMAS
// ============================================================================

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ============================================================================
// BRAND SCHEMAS
// ============================================================================

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

// ============================================================================
// CART SCHEMAS
// ============================================================================

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

// ============================================================================
// CHECKOUT SCHEMAS
// ============================================================================

export const checkoutSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(2).default('BD'),
  shippingMethod: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerNotes: z.string().max(1000).optional(),
  isGuest: z.boolean().default(false),
});

export const shippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().default('BD'),
});

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum({
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  }).optional(),
  paymentStatus: z.nativeEnum({
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  }).optional(),
  customerId: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum({
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  }),
  notes: z.string().optional(),
});

// ============================================================================
// CUSTOMER SCHEMAS
// ============================================================================

export const createCustomerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  password: z.string().min(8).optional(),
});

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string().optional(),
  newsletterSubscribed: z.boolean().optional(),
  smsSubscribed: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
});

export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']).default('shipping'),
  isDefault: z.boolean().default(false),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().default('BD'),
  phone: z.string().min(1),
});

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  content: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

// ============================================================================
// COUPON SCHEMAS
// ============================================================================

export const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  type: z.enum(['percentage', 'fixed_amount', 'free_shipping']).default('percentage'),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().positive().optional(),
  maxDiscountAmount: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  perCustomerLimit: z.coerce.number().int().positive().default(1),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();
export const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.coerce.number().positive(),
});

// ============================================================================
// HOMEPAGE SECTION SCHEMAS
// ============================================================================

export const homepageSectionSchema = z.object({
  type: z.enum([
    'hero',
    'promotional_banner',
    'featured_products',
    'new_arrivals',
    'best_sellers',
    'collections',
    'categories',
    'brand_showcase',
    'testimonials',
    'instagram_feed',
    'newsletter',
    'custom_content',
  ]),
  position: z.number().int().min(0),
  config: z.record(z.any()),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

// ============================================================================
// PAGINATION SCHEMA
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Type exports
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type CreateBrand = z.infer<typeof createBrandSchema>;
export type UpdateBrand = z.infer<typeof updateBrandSchema>;

export type AddToCart = z.infer<typeof addToCartSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type ApplyCoupon = z.infer<typeof applyCouponSchema>;

export type CheckoutData = z.infer<typeof checkoutSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
export type AddressData = z.infer<typeof addressSchema>;

export type CreateReview = z.infer<typeof createReviewSchema>;

export type CreateCoupon = z.infer<typeof createCouponSchema>;
export type UpdateCoupon = z.infer<typeof updateCouponSchema>;
export type ValidateCoupon = z.infer<typeof validateCouponSchema>;

export type HomepageSectionData = z.infer<typeof homepageSectionSchema>;
export type Pagination = z.infer<typeof paginationSchema>;