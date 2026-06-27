import { redirect } from 'next/navigation';
import { Package, Heart, MapPin, User } from 'lucide-react';
import { AccountNav } from '@/components/store';

export const metadata = {
  title: 'My Account',
  description: 'Manage your account',
};

export default async function AccountPage() {
  // For demo, show placeholder
  // In production: const { user } = await getSession()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div>
                <p className="font-medium">Guest User</p>
                <p className="text-sm text-gray-500">user@example.com</p>
              </div>
            </div>
            <AccountNav />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border p-6">
            <h1 className="text-xl font-medium mb-6">Welcome to Your Account</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/account/orders" className="p-4 border rounded-lg hover:border-black transition-colors">
                <Package className="w-6 h-6 mb-2" />
                <p className="font-medium">My Orders</p>
                <p className="text-sm text-gray-500">View and track your orders</p>
              </a>
              
              <a href="/account/wishlist" className="p-4 border rounded-lg hover:border-black transition-colors">
                <Heart className="w-6 h-6 mb-2" />
                <p className="font-medium">Wishlist</p>
                <p className="text-sm text-gray-500">Your saved items</p>
              </a>
              
              <a href="/account/addresses" className="p-4 border rounded-lg hover:border-black transition-colors">
                <MapPin className="w-6 h-6 mb-2" />
                <p className="font-medium">Addresses</p>
                <p className="text-sm text-gray-500">Manage your addresses</p>
              </a>
              
              <a href="/account/profile" className="p-4 border rounded-lg hover:border-black transition-colors">
                <User className="w-6 h-6 mb-2" />
                <p className="font-medium">Profile</p>
                <p className="text-sm text-gray-500">Update your information</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}