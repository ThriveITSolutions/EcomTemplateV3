'use client';

import { useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  role: string;
  avatar: string | null;
}

export interface Customer {
  id: string;
  userId: string;
  user: User;
  loyaltyPoints: number;
  loyaltyTier: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // In production, this would call the Better Auth session endpoint
      // For now, we'll simulate a check
      const response = await fetch('/api/auth/session');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setCustomer(data.customer);
      } else {
        setUser(null);
        setCustomer(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to check authentication');
      setUser(null);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      setUser(data.user);
      setCustomer(data.customer);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Auto sign in after registration
      return signIn(data.email, data.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [signIn]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      await fetch('/api/auth/signout', { method: 'POST' });
      
      setUser(null);
      setCustomer(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Sign out failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/customers/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Update failed');
      }

      setUser(prev => prev ? { ...prev, ...result.user } : null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    customer,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshAuth: checkAuth,
  };
}