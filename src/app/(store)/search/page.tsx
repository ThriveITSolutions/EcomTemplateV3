import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/store';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export function generateMetadata({ searchParams }: SearchPageProps) {
  return {
    title: 'Search',
    description: 'Search our products',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const sortBy = params.sort || 'relevance';
  const page = parseInt(params.page || '1', 10);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
      </div>

      {/* Content */}
      {query ? (
        <Suspense fallback={<div className="h-96">Loading...</div>}>
          <ProductGrid
            search={query}
            sortBy={sortBy}
            page={page}
          />
        </Suspense>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Start Searching</h2>
          <p className="text-gray-500">
            Enter a search term above to find products
          </p>
        </div>
      )}
    </div>
  );
}