/**
 * Database Seeding Script
 * 
 * Run with: npm run db:seed
 */

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default permissions
  const permissions = [
    { resource: 'products', action: 'read', description: 'View products' },
    { resource: 'products', action: 'create', description: 'Create products' },
    { resource: 'products', action: 'update', description: 'Update products' },
    { resource: 'products', action: 'delete', description: 'Delete products' },
    { resource: 'orders', action: 'read', description: 'View orders' },
    { resource: 'orders', action: 'update', description: 'Update orders' },
    { resource: 'orders', action: 'refund', description: 'Process refunds' },
    { resource: 'customers', action: 'read', description: 'View customers' },
    { resource: 'customers', action: 'update', description: 'Update customers' },
    { resource: 'marketing', action: 'manage', description: 'Manage marketing' },
    { resource: 'settings', action: 'manage', description: 'Manage settings' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: perm.resource,
          action: perm.action,
        }
      },
      update: {},
      create: perm,
    });
  }
  console.log('Created default permissions');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      displayName: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log('Created admin user: admin@example.com / admin123');

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      displayName: 'Test Customer',
      firstName: 'Test',
      lastName: 'Customer',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  // Create customer profile
  await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      newsletterSubscribed: true,
    },
  });
  console.log('Created customer user: customer@example.com / customer123');

  // Create default warehouse
  await prisma.warehouse.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Main Warehouse',
      code: 'MAIN',
      city: 'Dhaka',
      country: 'BD',
      isDefault: true,
    },
  });
  console.log('Created default warehouse');

  // Create product categories
  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium quality t-shirts', sortOrder: 1 },
    { name: 'Shirts', slug: 'shirts', description: 'Formal and casual shirts', sortOrder: 2 },
    { name: 'Pants', slug: 'pants', description: 'Jeans and trousers', sortOrder: 3 },
    { name: 'Jackets', slug: 'jackets', description: 'Outerwear and jackets', sortOrder: 4 },
    { name: 'Accessories', slug: 'accessories', description: 'Bags, belts, and more', sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, path: `/${cat.slug}` },
    });
  }
  console.log('Created product categories');

  // Create brands
  const brands = [
    { name: 'Basic Thread', slug: 'basic-thread', description: 'Essential everyday wear' },
    { name: 'Urban Edge', slug: 'urban-edge', description: 'Streetwear and urban fashion' },
    { name: 'Premium Line', slug: 'premium-line', description: 'High-end fashion' },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log('Created brands');

  // Create sample products
  const products = [
    {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-t-shirt',
      description: 'A comfortable and stylish premium cotton t-shirt perfect for everyday wear.',
      shortDescription: 'Comfortable cotton t-shirt',
      basePrice: 1200,
      sku: 'PCT-001',
      material: '100% Cotton',
      gender: 'unisex',
      categorySlugs: ['t-shirts'],
      brandSlug: 'basic-thread',
    },
    {
      name: 'Slim Fit Jeans',
      slug: 'slim-fit-jeans',
      description: 'Modern slim fit jeans with a perfect blend of style and comfort.',
      shortDescription: 'Modern slim fit jeans',
      basePrice: 2500,
      sku: 'SFJ-001',
      material: '98% Cotton, 2% Elastane',
      gender: 'men',
      categorySlugs: ['pants'],
      brandSlug: 'urban-edge',
    },
    {
      name: 'Casual Linen Shirt',
      slug: 'casual-linen-shirt',
      description: 'Breathable linen shirt perfect for warm weather.',
      shortDescription: 'Breathable linen shirt',
      basePrice: 1800,
      sku: 'CLS-001',
      material: '100% Linen',
      gender: 'men',
      categorySlugs: ['shirts'],
      brandSlug: 'premium-line',
    },
    {
      name: 'Denim Jacket',
      slug: 'denim-jacket',
      description: 'Classic denim jacket with modern styling.',
      shortDescription: 'Classic denim jacket',
      basePrice: 3500,
      sku: 'DJ-001',
      material: '100% Denim',
      gender: 'unisex',
      categorySlugs: ['jackets'],
      brandSlug: 'urban-edge',
    },
    {
      name: 'Cargo Shorts',
      slug: 'cargo-shorts',
      description: 'Practical cargo shorts with multiple pockets.',
      shortDescription: 'Practical cargo shorts',
      basePrice: 1500,
      sku: 'CS-001',
      material: '65% Polyester, 35% Cotton',
      gender: 'men',
      categorySlugs: ['pants'],
      brandSlug: 'basic-thread',
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existingProduct) {
      const brand = await prisma.brand.findUnique({ where: { slug: product.brandSlug } });
      const category = await prisma.category.findUnique({ where: { slug: product.categorySlugs[0] } });

      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          basePrice: product.basePrice,
          sku: product.sku,
          material: product.material,
          gender: product.gender as 'men' | 'women' | 'unisex' | 'kids',
          brandId: brand?.id,
          isActive: true,
          isPublished: true,
        },
      });

      if (category) {
        await prisma.productCategory.create({
          data: {
            productId: createdProduct.id,
            categoryId: category.id,
          },
        });
      }

      // Create default variant
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          sku: `${product.sku}-DEFAULT`,
          options: {},
          inventoryQuantity: 50,
        },
      });

      console.log(`Created product: ${product.name}`);
    }
  }

  // Create homepage sections
  const sections = [
    { type: 'hero', position: 0, isActive: true, config: { title: 'New Collection', subtitle: 'Discover our latest arrivals', ctaText: 'Shop Now', ctaLink: '/products' } },
    { type: 'new_arrivals', position: 1, isActive: true, config: { title: 'New Arrivals', subtitle: 'Fresh styles just landed' } },
    { type: 'categories', position: 2, isActive: true, config: { title: 'Shop by Category', subtitle: 'Find your perfect style' } },
    { type: 'featured_products', position: 3, isActive: true, config: { title: 'Featured Products', subtitle: 'Our top picks for you' } },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { id: section.type },
      update: { position: section.position, config: section.config, isActive: section.isActive },
      create: {
        id: section.type,
        type: section.type,
        position: section.position,
        config: section.config,
        isActive: section.isActive,
      },
    });
  }
  console.log('Created homepage sections');

  // Create default store settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'Fashion Store',
      storeTagline: 'Your Style, Your Way',
      storeLogo: '/logo.svg',
      currency: 'BDT',
      currencySymbol: '৳',
      locale: 'en-US',
      timezone: 'Asia/Dhaka',
      features: {
        wishlist: true,
        reviews: true,
        coupons: true,
        inventoryTracking: true,
        guestCheckout: true,
        newsletter: true,
      },
      taxEnabled: true,
      taxRate: 7.5,
      taxInclusive: false,
      freeShippingThreshold: 2000,
    },
  });
  console.log('Created default store settings');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });