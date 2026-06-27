import Link from 'next/link';
import { Package, ChevronRight, Eye, Truck } from 'lucide-react';

// Sample order data
const orders = [
  {
    id: 'ORD-2024-0006',
    date: '2024-01-15',
    status: 'Delivered',
    items: [
      { name: 'Premium Cotton T-Shirt', variant: 'Black / M', price: 1200, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100' },
    ],
    subtotal: 2400,
    shipping: 0,
    total: 2580,
  },
  {
    id: 'ORD-2024-0005',
    date: '2024-01-10',
    status: 'Shipped',
    items: [
      { name: 'Slim Fit Jeans', variant: '32 / Blue', price: 2500, quantity: 1, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100' },
      { name: 'Casual Linen Shirt', variant: 'White / L', price: 1800, quantity: 1, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100' },
    ],
    subtotal: 4300,
    shipping: 100,
    total: 4622,
  },
  {
    id: 'ORD-2024-0004',
    date: '2024-01-05',
    status: 'Processing',
    items: [
      { name: 'Denim Jacket', variant: 'Blue / M', price: 3500, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100' },
    ],
    subtotal: 3500,
    shipping: 0,
    total: 3762,
  },
];

const getStatusBadge = (status: string) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
};

export const metadata = {
  title: 'My Orders',
  description: 'View your order history',
};

export default function AccountOrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">My Orders</h1>
        <p className="text-sm text-gray-500">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-medium mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-black text-white rounded hover:bg-gray-800">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-medium">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-3 min-w-fit">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.variant}</p>
                        <p className="text-sm mt-1">৳{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-gray-50">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {order.status === 'Shipped' && (
                    <button className="flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-gray-50">
                      <Truck className="w-4 h-4" />
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}