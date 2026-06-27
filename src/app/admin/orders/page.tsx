import { Search, Filter, Eye, Truck, XCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Orders',
  description: 'Manage orders',
};

export default function AdminOrdersPage() {
  // Placeholder data
  const orders = [
    { id: 'ORD-2024-0001', customer: 'Rahim Ahmed', email: 'rahim@example.com', total: 2500, items: 3, status: 'PENDING', payment: 'PAID', date: '2024-01-15' },
    { id: 'ORD-2024-0002', customer: 'Fatema Begum', email: 'fatema@example.com', total: 4500, items: 5, status: 'PROCESSING', payment: 'PAID', date: '2024-01-14' },
    { id: 'ORD-2024-0003', customer: 'Karim Hussain', email: 'karim@example.com', total: 1800, items: 2, status: 'SHIPPED', payment: 'PAID', date: '2024-01-13' },
    { id: 'ORD-2024-0004', customer: 'Nusrat Jahan', email: 'nusrat@example.com', total: 3200, items: 4, status: 'DELIVERED', payment: 'PAID', date: '2024-01-12' },
    { id: 'ORD-2024-0005', customer: 'Jamal Uddin', email: 'jamal@example.com', total: 2100, items: 2, status: 'PENDING', payment: 'PENDING', date: '2024-01-11' },
    { id: 'ORD-2024-0006', customer: 'Sabina Yasmin', email: 'sabina@example.com', total: 5500, items: 6, status: 'CANCELLED', payment: 'REFUNDED', date: '2024-01-10' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PROCESSING: 'bg-purple-100 text-purple-700',
      SHIPPED: 'bg-indigo-100 text-indigo-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      REFUNDED: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentBadge = (status: string) => {
    return status === 'PAID' 
      ? 'bg-green-100 text-green-700' 
      : status === 'PENDING' 
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-gray-500">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer name or email..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Payments</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
            <input 
              type="date" 
              className="px-3 py-2 border rounded-md text-sm"
              placeholder="Date from"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <a href={`/admin/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {order.id}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{order.items} items</td>
                <td className="px-6 py-4 text-sm font-medium">৳{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(order.payment)}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Ship">
                      <Truck className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Cancel">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-6 of 156 orders</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border rounded bg-black text-white">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">...</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">16</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}