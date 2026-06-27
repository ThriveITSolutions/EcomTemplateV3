import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';

// Sample wishlist items
const wishlistItems = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 1200,
    compareAtPrice: 1500,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    slug: 'premium-cotton-t-shirt',
    inStock: true,
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 2500,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    slug: 'slim-fit-jeans',
    inStock: true,
  },
  {
    id: '3',
    name: 'Casual Linen Shirt',
    price: 1800,
    compareAtPrice: 2200,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    slug: 'casual-linen-shirt',
    inStock: false,
  },
];

export const metadata = {
  title: 'My Wishlist',
  description: 'Your saved items',
};

export default function WishlistPage() {
  if (wishlistItems.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium">My Wishlist</h1>
          <p className="text-sm text-gray-500">Items you've saved</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-4">Save items you love to your wishlist</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-black text-white rounded hover:bg-gray-800">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">My Wishlist</h1>
          <p className="text-sm text-gray-500">{wishlistItems.length} items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden group">
            <div className="relative aspect-[3/4] bg-gray-100">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-50">
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white px-4 py-2 rounded text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{item.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">৳{item.price.toLocaleString()}</span>
                {item.compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">৳{item.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 border rounded hover:bg-black hover:text-white transition-colors">
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}