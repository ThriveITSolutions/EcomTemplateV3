import { ProductCard } from './ProductCard';

interface ProductGridProps {
  search?: string;
  categorySlug?: string;
  sortBy?: string;
  page?: number;
}

export async function ProductGrid({ search, categorySlug, sortBy, page }: ProductGridProps) {
  // Demo placeholder products
  const products = [
    { id: '1', name: 'Premium Cotton T-Shirt', price: 1200, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', slug: 'premium-cotton-t-shirt' },
    { id: '2', name: 'Slim Fit Jeans', price: 2500, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', slug: 'slim-fit-jeans' },
    { id: '3', name: 'Casual Linen Shirt', price: 1800, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', slug: 'casual-linen-shirt' },
    { id: '4', name: 'Denim Jacket', price: 3500, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', slug: 'denim-jacket' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
