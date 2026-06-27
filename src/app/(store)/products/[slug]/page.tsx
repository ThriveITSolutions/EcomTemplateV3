import { notFound } from 'next/navigation';
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCw, Shield, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Sample product data - in production this would come from database
const sampleProduct = {
  id: '1',
  name: 'Premium Cotton T-Shirt',
  slug: 'premium-cotton-t-shirt',
  price: 1200,
  compareAtPrice: 1500,
  description: 'A comfortable and stylish premium cotton t-shirt perfect for everyday wear. Made from 100% premium cotton, this t-shirt offers exceptional comfort and durability. The fabric is soft against the skin and retains its shape wash after wash.',
  shortDescription: 'Premium 100% cotton t-shirt for everyday comfort',
  sku: 'PCT-001',
  material: '100% Cotton',
  brand: 'Basic Thread',
  category: 'T-Shirts',
  stock: 45,
  rating: 4.5,
  reviewCount: 128,
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
  ],
  variants: {
    colors: ['Black', 'White', 'Navy', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  features: [
    { icon: Truck, text: 'Free shipping on orders over ৳2,000' },
    { icon: RotateCw, text: '30-day easy returns' },
    { icon: Shield, text: 'Authentic product guarantee' },
  ],
  reviews: [
    { name: 'Ahmed K.', rating: 5, date: '2024-01-10', comment: 'Excellent quality! The fabric is so soft and comfortable. Perfect for everyday wear.' },
    { name: 'Fatema R.', rating: 4, date: '2024-01-08', comment: 'Great t-shirt, but the fit runs slightly small. Ordered a size up and it was perfect.' },
    { name: 'Karim H.', rating: 5, date: '2024-01-05', comment: 'Best t-shirt I have ever bought. The quality is amazing and the price is very reasonable.' },
  ],
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // In production, fetch product from database using slug
  // const product = await getProductBySlug(slug);
  
  // Format slug back to title case for name
  const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Create a dynamic sample product based on the slug
  const product = {
    ...sampleProduct,
    id: slug,
    slug: slug,
    name: formattedName,
    shortDescription: `Premium ${formattedName.toLowerCase()} for everyday comfort`,
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold tracking-tight">
              FASHION STORE
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/products" className="hover:text-gray-600">New Arrivals</Link>
              <Link href="/category/t-shirts" className="hover:text-gray-600">T-Shirts</Link>
              <Link href="/category/shirts" className="hover:text-gray-600">Shirts</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/search" className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-black">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/category/t-shirts" className="hover:text-black">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  className={`aspect-square rounded overflow-hidden border-2 ${
                    index === 0 ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-medium">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">৳{product.price.toLocaleString()}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">৳{product.compareAtPrice.toLocaleString()}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600">{product.shortDescription}</p>

            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium mb-3">Color: <span className="font-normal">Black</span></p>
              <div className="flex gap-2">
                {product.variants.colors.map((color) => (
                  <button 
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      color === 'Black' ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'gray' ? '#9ca3af' : color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Size</p>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.variants.sizes.map((size) => (
                  <button 
                    key={size}
                    className="px-4 py-2 border rounded text-sm hover:border-black transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border rounded">
                <button className="p-3 hover:bg-gray-100">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">1</span>
                <button className="p-3 hover:bg-gray-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="flex-1 bg-black text-white py-3 px-6 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-3 border rounded hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Info */}
            <p className="text-sm text-green-600">
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </p>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              {product.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3 text-sm text-gray-600">
                  <feature.icon className="w-5 h-5" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-medium">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p className="font-medium">{product.material}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium">Customer Reviews</h2>
            <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Fashion Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  return {
    title: 'Premium Cotton T-Shirt',
    description: 'Shop our premium cotton t-shirt - comfortable, stylish, and perfect for everyday wear.',
  };
}