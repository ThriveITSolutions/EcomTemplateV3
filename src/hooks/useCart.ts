'use client';

import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  variant: {
    id: string;
    options: Record<string, string>;
    price: number | null;
    image: string | null;
  } | null;
  subtotal: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  coupon: {
    code: string;
    type: string;
    value: number;
  } | null;
  summary: CartSummary;
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCart(data.cart);
      setError(null);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCallback(async (
    productId: string,
    variantId?: string,
    quantity: number = 1
  ) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const updateItemQuantity = useCallback(async (
    itemId: string,
    quantity: number
  ) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update item');
      }

      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item');
      }

      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal: cart?.summary.subtotal || 0 }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.valid) {
        throw new Error(data.error || 'Invalid coupon');
      }

      await fetchCart();
      return { success: true, discount: data.coupon.discount };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply coupon';
      setError(message);
      return { success: false, error: message };
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCart(null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  return {
    cart,
    loading,
    error,
    addItem,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    clearCart,
    refreshCart: fetchCart,
    itemCount: cart?.summary.itemCount || 0,
    total: cart?.summary.total || 0,
  };
}