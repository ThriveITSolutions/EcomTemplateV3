# White-Label E-Commerce Platform

A production-ready, reusable e-commerce platform designed for agency client deployments. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Cloudflare R2 account (optional, for storage)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-platform

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your database URL and other settings
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data (optional)
npm run db:seed
```

### Running the Project

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit:
- **Storefront**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Prisma Studio**: npm run db:studio

---

## 📁 Project Structure

```
ecommerce-platform/
├── prisma/
│   ├── schema.prisma          # Database schema (25+ models)
│   └── seed.ts                # Database seeding
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (store)/          # Storefront pages
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── products/     # Product listing & detail
│   │   │   ├── category/     # Category pages
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── checkout/     # Checkout flow
│   │   │   ├── account/      # Customer dashboard
│   │   │   └── search/       # Search results
│   │   ├── admin/            # Admin dashboard
│   │   │   ├── dashboard/    # Overview & stats
│   │   │   ├── products/     # Product management
│   │   │   ├── orders/       # Order management
│   │   │   ├── customers/    # Customer management
│   │   │   ├── marketing/    # Coupons & promotions
│   │   │   ├── inventory/    # Stock management
│   │   │   ├── content/      # CMS & homepage builder
│   │   │   ├── settings/     # Store configuration
│   │   │   └── users/        # User management
│   │   ├── api/              # API routes
│   │   ├── auth/             # Auth pages
│   │   └── sitemap.ts        # Sitemap generation
│   │
│   ├── components/
│   │   ├── ui/               # Base UI components (shadcn/ui)
│   │   ├── store/            # Storefront components
│   │   ├── admin/            # Admin components
│   │   └── shared/           # Shared utilities
│   │
│   ├── features/             # Feature modules
│   │   ├── products/         # Product service + repository
│   │   ├── cart/             # Cart service + repository
│   │   ├── orders/           # Order service + repository
│   │   ├── customers/        # Customer service + repository
│   │   ├── categories/       # Category service + repository
│   │   ├── reviews/          # Review service + repository
│   │   ├── marketing/        # Marketing service + repository
│   │   └── inventory/        # Inventory service + repository
│   │
│   ├── services/             # Core services
│   │   ├── storage/          # Storage abstraction (R2, S3, Local)
│   │   └── email/            # Email service
│   │
│   ├── lib/                  # Core utilities
│   │   ├── prisma.ts         # Prisma client
│   │   ├── utils.ts          # Utility functions
│   │   └── validation/       # Zod validation schemas
│   │
│   ├── config/               # Configuration system
│   │   ├── storeConfig.ts    # Store settings
│   │   ├── themeConfig.ts    # Theme engine
│   │   └── features.ts       # Feature flags
│   │
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── styles/
│       └── globals.css       # Global styles + CSS variables
│
├── public/                   # Static assets
├── .env.example              # Environment template
└── package.json
```

---

## 🎨 Theme System

The platform includes a powerful theme engine with CSS variables and industry presets.

### Available Themes

- **Fashion** (default) - Zara/H&M style
- **Electronics** - Tech store aesthetic
- **Cosmetics** - Beauty brand feel
- **Pharmacy** - Clean medical look
- **Grocery** - Fresh market style
- **Wholesale** - B2B professional

### Customizing Theme

Edit `src/config/themeConfig.ts`:

```typescript
export const themeConfig = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
  },
  // ... more options
};
```

---

## ⚙️ Configuration System

Feature flags and store settings are managed through configuration files and database.

### Store Configuration (`src/config/storeConfig.ts`)

```typescript
export const storeConfig = {
  storeName: 'Fashion Store',
  currency: {
    code: 'BDT',
    symbol: '৳',
  },
  features: {
    wishlist: true,
    reviews: true,
    coupons: true,
    inventoryTracking: true,
    guestCheckout: true,
    // ...
  },
};
```

### Feature Flags

Toggle features in `src/config/features.ts`:

```typescript
export const features = {
  WISHLIST: true,
  REVIEWS: true,
  COUPONS: true,
  // ...
};
```

---

## 🗄️ Database Schema

The platform includes 25+ database models covering:

### Authentication & Users
- User, Account, Session, VerificationToken
- Permission, UserPermission

### Customer Management
- Customer, Address

### Product Catalog
- Product, ProductVariant, ProductImage
- ProductAttribute, ProductCategory
- Category, Brand, ProductSEO

### Inventory
- Inventory, StockMovement, Warehouse

### Orders
- Order, OrderItem, OrderStatusHistory

### Cart & Wishlist
- Cart, CartItem, WishlistItem

### Marketing
- Coupon, Promotion, FeaturedProduct

### Content
- Page, HomepageSection

### Settings
- StoreSettings, PaymentSettings
- ShippingZone, ShippingProviderSetting

### Analytics
- ActivityLog, PageView

---

## 💳 Payment Integration

The platform includes a payment abstraction layer with pluggable providers.

### Supported Providers
- Stripe (Credit/Debit cards)
- bKash (Mobile banking)
- SSLCommerz
- Cash on Delivery

### Adding a New Provider

1. Create provider in `src/features/payments/providers/`
2. Implement `PaymentProvider` interface
3. Register in `src/features/payments/services/paymentService.ts`

```typescript
class StripeProvider implements PaymentProvider {
  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    // Implementation
  }
  // ...
}
```

---

## 📦 Storage Integration

Pluggable storage providers for product images, banners, and files.

### Supported Providers
- Cloudflare R2 (default)
- AWS S3
- Local filesystem (development)

### Configuration

```typescript
// .env.local
STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=your-bucket
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

---

## 🔐 Authentication

Uses Better Auth with:

- Email/Password authentication
- Google OAuth
- Session management
- Role-based access control (RBAC)

### Roles
- SUPER_ADMIN - Full access
- STORE_ADMIN - Store management
- MANAGER - Intermediate permissions
- STAFF - Limited access
- CUSTOMER - Frontend only

---

## 📱 Admin Dashboard

Complete admin panel with:

### Dashboard
- Sales overview & revenue
- Order statistics
- Customer metrics
- Inventory alerts
- Recent activity

### Product Management
- CRUD operations
- Variant management
- Image upload
- Bulk operations
- Category & brand management

### Order Management
- Order tracking
- Status updates
- Refund processing
- Invoice generation
- Export functionality

### Customer Management
- Customer profiles
- Order history
- Address management

### Marketing
- Coupon creation
- Promotion banners
- Featured products
- Homepage section builder

### Settings
- Store configuration
- Theme settings
- Payment providers
- Shipping zones
- Email settings
- Security settings

---

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `STRIPE_SECRET_KEY`
   - `R2_*` variables
3. Deploy

### Supabase (Database)

1. Create a new Supabase project
2. Get the connection string from Settings > Database
3. Add to environment variables

### Cloudflare R2 (Storage)

1. Create an R2 bucket
2. Generate API tokens
3. Add credentials to environment variables

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

---

## 📊 API Routes

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/[slug]` - Update product
- `DELETE /api/products/[slug]` - Delete product (soft delete)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category

### Brands
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create brand

### Cart
- `GET /api/cart` - Get current cart with summary
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/items/[id]` - Update item quantity
- `DELETE /api/cart/items/[id]` - Remove item

### Orders
- `GET /api/orders` - List orders with filters
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]/status` - Update order status

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/me` - Get current customer profile
- `PUT /api/customers/me` - Update customer profile

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist?id=...` - Remove from wishlist

### Reviews
- `GET /api/reviews?productId=xxx` - Get product reviews
- `POST /api/reviews` - Submit review

### Coupons
- `GET /api/coupons` - List coupons
- `POST /api/coupons` - Validate coupon code
- `PUT /api/coupons` - Create/Update coupon

### Authentication
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/register` - Register new user

### Upload
- `POST /api/upload` - Upload file
- `DELETE /api/upload?path=...` - Delete file

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/bkash` - bKash webhook handler

---

## 🎯 Future Multi-Tenancy

The architecture is designed to support future migration to multi-tenant SaaS:

- Repository pattern abstracts data access
- No cross-tenant references in schema
- Clean separation of concerns
- Configuration-driven architecture

When/if needed:
1. Add `tenantId` to all models
2. Create tenant middleware
3. Update repositories to filter by tenant
4. Implement tenant provisioning

---

## 📝 License

Private - All rights reserved

---

## 🆘 Support

For issues and questions, please contact the development team.