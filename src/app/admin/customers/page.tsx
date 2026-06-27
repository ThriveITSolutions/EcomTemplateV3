import { Search, Filter, Eye, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Customers',
  description: 'Manage customers',
};

export default function AdminCustomersPage() {
  // Placeholder data
  const customers = [
    { id: '1', name: 'Rahim Ahmed', email: 'rahim@example.com', phone: '+880 1712345678', orders: 5, spent: 12500, joinDate: '2024-01-10' },
    { id: '2', name: 'Fatema Begum', email: 'fatema@example.com', phone: '+880 1712345679', orders: 8, spent: 45000, joinDate: '2024-01-08' },
    { id: '3', name: 'Karim Hussain', email: 'karim@example.com', phone: '+880 1712345680', orders: 3, spent: 8500, joinDate: '2024-01-05' },
    { id: '4', name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '+880 1712345681', orders: 12, spent: 62500, joinDate: '2023-12-20' },
    { id: '5', name: 'Jamal Uddin', email: 'jamal@example.com', phone: '+880 1712345682', orders: 2, spent: 3200, joinDate: '2024-01-02' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-sm text-gray-500">View and manage customer accounts</p>
        </div>
        <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
          Export Customers
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or phone..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Customers</option>
              <option>New Customers</option>
              <option>Returning Customers</option>
              <option>VIP Customers</option>
            </select>
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Orders</th>
              <th className="px-6 py-3 font-medium">Total Spent</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">{customer.name.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {customer.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{customer.orders}</td>
                <td className="px-6 py-4 text-sm font-medium">৳{customer.spent.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{customer.joinDate}</td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-gray-100 rounded" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-5 of 89 customers</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border rounded bg-black text-white">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">...</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">9</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}