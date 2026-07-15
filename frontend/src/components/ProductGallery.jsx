import { useEffect, useState } from "react";

const ProductGallery = ({ images, name }) => {
  const safeImages = images?.filter(Boolean) || [];
  const firstImage = safeImages[0];
  const [activeImage, setActiveImage] = useState(firstImage);

  const displayImage = activeImage || firstImage;

  useEffect(() => {
    setActiveImage(firstImage);
  }, [firstImage]);

  return (
    <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {safeImages.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`h-24 w-20 shrink-0 overflow-hidden border bg-gray-100 ${
              displayImage === image ? "border-gray-900" : "border-transparent"
            }`}
          >
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="aspect-[4/5] overflow-hidden bg-gray-100 sm:aspect-[4/4.6]">
        {displayImage && (
          <img
            src={displayImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
};
export default ProductGallery;
