import { Plus, Tag, Percent, Calendar, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Marketing',
  description: 'Manage coupons and promotions',
};

export default function AdminMarketingPage() {
  // Placeholder data
  const coupons = [
    { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 1000, usage: 45, limit: 100, status: 'Active', expires: '2024-02-28' },
    { id: '2', code: 'FLAT200', type: 'fixed', value: 200, minOrder: 1500, usage: 78, limit: null, status: 'Active', expires: '2024-01-31' },
    { id: '3', code: 'FREESHIP', type: 'free_shipping', value: 0, minOrder: 2000, usage: 156, limit: null, status: 'Active', expires: '2024-03-15' },
    { id: '4', code: 'SUMMER20', type: 'percentage', value: 20, minOrder: 2000, usage: 0, limit: 50, status: 'Scheduled', expires: '2024-04-30' },
    { id: '5', code: 'OLD50', type: 'percentage', value: 50, minOrder: 5000, usage: 50, limit: 50, status: 'Expired', expires: '2024-01-01' },
  ];

  const getTypeBadge = (type: string) => {
    const styles = {
      percentage: 'bg-blue-100 text-blue-700',
      fixed: 'bg-green-100 text-green-700',
      free_shipping: 'bg-purple-100 text-purple-700',
    };
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 text-green-700',
      Scheduled: 'bg-blue-100 text-blue-700',
      Expired: 'bg-gray-100 text-gray-700',
      Disabled: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Marketing</h1>
          <p className="text-sm text-gray-500">Manage coupons and promotional campaigns</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Promotions
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button className="pb-3 px-1 text-sm font-medium border-b-2 border-black">Coupons</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Banners</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Featured Products</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Email Campaigns</button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Coupon Code</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Min. Order</th>
              <th className="px-6 py-3 font-medium">Usage</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Expires</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="font-medium font-mono">{coupon.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadge(coupon.type)}`}>
                    {coupon.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'free_shipping' ? 'Free Shipping' : `৳${coupon.value}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">৳{coupon.minOrder.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-medium">{coupon.usage}</span>
                  {coupon.limit && <span className="text-gray-500"> / {coupon.limit}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(coupon.status)}`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{coupon.expires}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-600" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}