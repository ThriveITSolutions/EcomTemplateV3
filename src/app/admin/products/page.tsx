import { Plus, Search, Filter, MoreHorizontal, Image as ImageIcon, Pencil, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Products',
  description: 'Manage products',
};

export default function AdminProductsPage() {
  // Placeholder data - in production this would come from API
  const products = [
    { id: '1', name: 'Premium Cotton T-Shirt', sku: 'PCT-001', price: 1200, stock: 45, status: 'Active', image: '' },
    { id: '2', name: 'Slim Fit Jeans', sku: 'SFJ-002', price: 2500, stock: 32, status: 'Active', image: '' },
    { id: '3', name: 'Casual Linen Shirt', sku: 'CLS-003', price: 1800, stock: 28, status: 'Active', image: '' },
    { id: '4', name: 'Denim Jacket', sku: 'DJ-004', price: 3500, stock: 15, status: 'Active', image: '' },
    { id: '5', name: 'Cargo Shorts', sku: 'CS-005', price: 1500, stock: 0, status: 'Out of Stock', image: '' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Categories</option>
              <option>T-Shirts</option>
              <option>Pants</option>
              <option>Shirts</option>
            </select>
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover rounded" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 text-sm">৳{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${product.stock === 0 ? 'text-red-600 font-medium' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'Active' ? 'bg-green-100 text-green-700' :
                    product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Pencil className="w-4 h-4" />
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-5 of 156 products</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
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