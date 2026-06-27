import { Suspense } from 'react';
import { ProductGrid } from '@/components/store';
interface ProductListingPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse our collection of fashion products',
};

export default async function ProductsPage({ searchParams }: ProductListingPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const categorySlug = params.category || '';
  const sortBy = params.sort || 'newest';
  const page = parseInt(params.page || '1', 10);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">
          {search ? `Search results for "${search}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Discover our collection</p>
      </div>

      {/* Content */}
      <Suspense fallback={<div className="h-96">Loading...</div>}>
        <ProductGrid
          search={search}
          categorySlug={categorySlug}
          sortBy={sortBy}
          page={page}
        />
      </Suspense>
    </div>
  );
}