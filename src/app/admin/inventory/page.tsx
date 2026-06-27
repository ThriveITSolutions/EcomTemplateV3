import { Search, AlertTriangle, Package, TrendingDown, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Inventory',
  description: 'Manage inventory and stock',
};

export default function AdminInventoryPage() {
  // Placeholder data
  const lowStockProducts = [
    { id: '1', name: 'Premium Cotton T-Shirt - Black - M', sku: 'PCT-001-BK-M', stock: 3, threshold: 10 },
    { id: '2', name: 'Slim Fit Jeans - 32', sku: 'SFJ-002-32', stock: 5, threshold: 15 },
    { id: '3', name: 'Casual Linen Shirt - White - L', sku: 'CLS-003-WH-L', stock: 2, threshold: 10 },
    { id: '4', name: 'Denim Jacket - Blue - M', sku: 'DJ-004-BL-M', stock: 4, threshold: 8 },
  ];

  const stockSummary = [
    { label: 'Total Products', value: '156', icon: Package, color: 'text-blue-600' },
    { label: 'Low Stock Items', value: '12', icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Out of Stock', value: '3', icon: TrendingDown, color: 'text-red-600' },
    { label: 'Total Units', value: '4,250', icon: Package, color: 'text-green-600' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-gray-500">Monitor and manage stock levels</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Stock Adjustment
          </button>
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
            Export Report
          </button>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stockSummary.map((item) => (
          <div key={item.label} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-semibold mt-1">{item.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button className="pb-3 px-1 text-sm font-medium border-b-2 border-black">Low Stock Alerts</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">All Stock</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Stock History</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Warehouses</button>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2 bg-yellow-50">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">4 products are running low on stock and need attention.</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Current Stock</th>
              <th className="px-6 py-3 font-medium">Threshold</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-sm">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${product.stock <= 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.threshold} units</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.stock <= 3 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.stock <= 3 ? 'Critical' : 'Low'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}