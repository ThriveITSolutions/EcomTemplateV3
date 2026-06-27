export function ProductGallery({ images }: { images: string[] }) {
  return (
    <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
      {images && images.length > 0 ? (
        <img src={images[0]} alt="Product gallery" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
      )}
    </div>
  );
}
