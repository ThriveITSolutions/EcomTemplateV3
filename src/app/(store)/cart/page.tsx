'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

// Sample cart items
const initialItems = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    variant: 'Black / M',
    price: 1200,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    variant: '32 / Blue',
    price: 2500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200',
  },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 2000 ? 0 : 100;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b sticky top-0 bg-white z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold tracking-tight">FASHION STORE</Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-medium mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold tracking-tight">FASHION STORE</Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{items.length} items</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.variant}</p>
                      <p className="text-sm mt-1">SKU: PCT-001</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            <Link 
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mt-4"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-green-600">
                    Add ৳{(2000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                  <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
                    Apply
                  </button>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="mt-6 block w-full bg-black text-white py-3 text-center rounded font-medium hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Tax calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Fashion Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}