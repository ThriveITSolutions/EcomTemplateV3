import { Package, DollarSign, Users, TrendingUp, AlertTriangle, ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard',
};

export default function AdminDashboardPage() {
  // Placeholder data - in production this would come from API
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Orders', value: '156', change: '+8.2%', icon: Package, color: 'bg-blue-500' },
    { label: 'Customers', value: '89', change: '+15.3%', icon: Users, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.4%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentOrders = [
    { id: 'ORD-2024-0001', customer: 'Rahim Ahmed', amount: 2500, status: 'Processing', date: '2024-01-15' },
    { id: 'ORD-2024-0002', customer: 'Fatema Begum', amount: 4500, status: 'Shipped', date: '2024-01-14' },
    { id: 'ORD-2024-0003', customer: 'Karim Hussain', amount: 1800, status: 'Delivered', date: '2024-01-13' },
    { id: 'ORD-2024-0004', customer: 'Nusrat Jahan', amount: 3200, status: 'Pending', date: '2024-01-12' },
    { id: 'ORD-2024-0005', customer: 'Jamal Uddin', amount: 2100, status: 'Delivered', date: '2024-01-11' },
  ];

  const topProducts = [
    { name: 'Premium Cotton T-Shirt', sales: 45, revenue: 22500 },
    { name: 'Slim Fit Jeans', sales: 32, revenue: 32000 },
    { name: 'Casual Linen Shirt', sales: 28, revenue: 19600 },
    { name: 'Denim Jacket', sales: 22, revenue: 33000 },
    { name: 'Cargo Shorts', sales: 18, revenue: 10800 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <a href={`/admin/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                        {order.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.customer}</td>
                    <td className="px-6 py-4 text-sm">৳{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold">Top Products</h2>
            <a href="/admin/products" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                  <p className="text-sm font-medium">৳{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800">Low Stock Alert</h3>
              <p className="text-sm text-amber-600 mt-1">
                12 products are running low on stock. Review inventory levels.
              </p>
              <a href="/admin/inventory" className="text-sm text-amber-700 mt-2 inline-block hover:underline">
                View Inventory →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Pending Reviews</h3>
              <p className="text-sm text-blue-600 mt-1">
                5 product reviews are awaiting moderation.
              </p>
              <a href="/admin/reviews" className="text-sm text-blue-700 mt-2 inline-block hover:underline">
                Moderate Reviews →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}