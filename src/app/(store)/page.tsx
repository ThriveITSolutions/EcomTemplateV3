import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, CreditCard } from 'lucide-react';

// Hero banner content
const heroBanner = {
  title: 'NEW COLLECTION',
  subtitle: 'Discover the latest trends in fashion',
  description: 'Explore our curated collection of premium apparel designed for the modern lifestyle.',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  secondaryCtaText: 'View Lookbook',
  secondaryCtaLink: '/collections',
};

// Featured categories
const categories = [
  { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { name: 'Shirts', slug: 'shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
  { name: 'Pants', slug: 'pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
  { name: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
];

// New arrivals (placeholder products)
const newArrivals = [
  { id: '1', name: 'Premium Cotton T-Shirt', price: 1200, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', slug: 'premium-cotton-t-shirt' },
  { id: '2', name: 'Slim Fit Jeans', price: 2500, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', slug: 'slim-fit-jeans' },
  { id: '3', name: 'Casual Linen Shirt', price: 1800, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', slug: 'casual-linen-shirt' },
  { id: '4', name: 'Denim Jacket', price: 3500, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', slug: 'denim-jacket' },
];

// Promotional banners
const promotions = [
  { title: 'FREE SHIPPING', description: 'On orders over ৳2,000', icon: Truck },
  { title: 'SECURE PAYMENT', description: '100% secure checkout', icon: Shield },
  { title: 'EASY RETURNS', description: '30-day return policy', icon: CreditCard },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div 
          className="h-[500px] md:h-[600px] bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600)' }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <p className="text-sm tracking-widest mb-4 text-gray-300">NEW COLLECTION 2024</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {heroBanner.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                {heroBanner.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={heroBanner.ctaLink}
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors"
                >
                  {heroBanner.ctaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  href={heroBanner.secondaryCtaLink}
                  className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
                >
                  {heroBanner.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>FREE SHIPPING ON ORDERS OVER ৳2,000</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium">Shop by Category</h2>
            <Link href="/products" className="text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-lg">{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-medium">New Arrivals</h2>
              <p className="text-sm text-gray-500 mt-1">Fresh styles just landed</p>
            </div>
            <Link href="/products?sort=newest" className="text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 mb-3">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-sm text-gray-600">৳{product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div key={promo.title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <promo.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{promo.title}</p>
                  <p className="text-sm text-gray-500">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-medium mb-2">Join Our Newsletter</h2>
          <p className="text-gray-400 mb-6">Subscribe to get special offers and updates</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder:text-gray-400 focus:outline-none focus:border-white"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>


    </div>
  );
}