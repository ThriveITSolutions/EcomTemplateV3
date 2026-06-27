import { Plus, FileText, Globe, Layout, Pencil, Eye, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui';

export const metadata = {
  title: 'Content',
  description: 'Manage pages and content',
};

export default function AdminContentPage() {
  // Placeholder data
  const pages = [
    { id: '1', title: 'Homepage', slug: '/', type: 'Homepage', status: 'Published', updatedAt: '2024-01-15' },
    { id: '2', title: 'About Us', slug: '/about', type: 'Content Page', status: 'Published', updatedAt: '2024-01-10' },
    { id: '3', title: 'Contact', slug: '/contact', type: 'Content Page', status: 'Published', updatedAt: '2024-01-08' },
    { id: '4', title: 'FAQ', slug: '/faq', type: 'Content Page', status: 'Draft', updatedAt: '2024-01-05' },
    { id: '5', title: 'Shipping Info', slug: '/shipping', type: 'Content Page', status: 'Published', updatedAt: '2024-01-02' },
    { id: '6', title: 'Return Policy', slug: '/returns', type: 'Content Page', status: 'Published', updatedAt: '2024-01-01' },
  ];

  const homepageSections = [
    { id: '1', type: 'Hero Banner', name: 'Main Hero', status: 'Active', position: 1 },
    { id: '2', type: 'New Arrivals', name: 'New Arrivals Grid', status: 'Active', position: 2 },
    { id: '3', type: 'Categories', name: 'Shop by Category', status: 'Active', position: 3 },
    { id: '4', type: 'Featured Products', name: 'Featured Section', status: 'Active', position: 4 },
    { id: '5', type: 'Newsletter', name: 'Email Signup', status: 'Active', position: 5 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Content Management</h1>
          <p className="text-sm text-gray-500">Manage pages and homepage sections</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Page
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button className="pb-3 px-1 text-sm font-medium border-b-2 border-black">Pages</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Homepage Sections</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Navigation</button>
        <button className="pb-3 px-1 text-sm text-gray-500 hover:text-gray-700">Media Library</button>
      </div>

      {/* Homepage Sections */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Homepage Sections</h2>
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <p className="text-sm text-gray-500">Drag to reorder sections on the homepage</p>
          </div>
          <div className="divide-y">
            {homepageSections.map((section) => (
              <div key={section.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <button className="cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                    <Layout className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{section.name}</p>
                    <p className="text-xs text-gray-500">{section.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    section.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {section.status}
                  </span>
                  <span className="text-xs text-gray-500">Position {section.position}</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Preview">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static Pages */}
      <div>
        <h2 className="text-lg font-medium mb-4">Static Pages</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Page Title</th>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{page.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{page.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{page.updatedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Globe className="w-4 h-4" />
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
    </div>
  );
}