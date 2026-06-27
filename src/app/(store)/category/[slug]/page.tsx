import { notFound } from 'next/navigation';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // For demo, show placeholder
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-black">Home</a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">{categoryName}</h1>
        <p className="text-sm text-gray-500 mt-1">Browse products in this category</p>
      </div>

      {/* Placeholder content */}
      <div className="bg-gray-50 rounded-xl p-12 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">Category Coming Soon</h2>
        <p className="text-gray-500 mb-4">
          This category is being set up. Check back soon for products.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-black text-sm font-medium rounded-md hover:bg-black hover:text-white transition-colors"
        >
          Browse All Products
        </a>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: categoryName,
    description: `Shop ${categoryName} at our store`,
  };
}