export function ProductInfo({ product }: { product: any }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product?.name || "Product Name"}</h1>
      <p className="text-xl mb-4">৳{product?.price || "0"}</p>
      <div className="prose prose-sm text-gray-600 mb-6">
        <p>{product?.description || "Product description goes here."}</p>
      </div>
      <button className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        Add to Cart
      </button>
    </div>
  );
}
