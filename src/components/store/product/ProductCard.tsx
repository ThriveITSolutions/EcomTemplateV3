import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug || product.id}`} className="group">
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 mb-3">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"}
          alt={product.name || "Product"}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <p className="font-medium text-sm">{product.name || "Unnamed Product"}</p>
      <p className="text-sm text-gray-600">৳{product.price ? product.price.toLocaleString() : "0"}</p>
    </Link>
  );
}
