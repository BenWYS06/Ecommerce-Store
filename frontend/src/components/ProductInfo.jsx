import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]); // these code not auto reset state
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const fullStars = Math.floor(product.rating);
  const { addToCart } = useCartStore();

  useEffect(() => {
    // It ensure these three change state when have new product
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setSelectedQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    if (selectedSize.stock === 0) return;
    addToCart(product, selectedSize.size, selectedColor, selectedQuantity);
  };

  return (
    <div className="pt-1">
      <div className="flex items-center gap-5">
        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

        <div className="flex items-center gap-1">
          <span className="font-medium">SKU:</span>
          <span>{product.sku}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < fullStars
                  ? "fill-orange-500 text-orange-500"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}

          <span className="text-sm text-gray-600">({product.numReviews})</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {product.discountPrice > 0 ? (
          <>
            <p className="text-2xl font-semibold text-gray-900">
              ${product.discountPrice}
            </p>

            <p className="text-lg text-gray-400 line-through">
              ${product.price}
            </p>
          </>
        ) : (
          <p className="text-2xl font-semibold text-gray-900">
            ${product.price}
          </p>
        )}
      </div>

      <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
        {product.description}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-700">Select Color</p>

        <div className="flex gap-3">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color.toLowerCase() }}
              className={`h-8 w-8 rounded-full border-2 transition hover:scale-105 ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-700">Select Size</p>

        <div className="flex flex-wrap gap-3">
          {product.sizes.map((item) => (
            <button
              key={item.size}
              disabled={item.stock === 0}
              onClick={() => setSelectedSize(item)}
              className={`h-11 w-11 border text-sm ${
                selectedSize.size === item.size
                  ? "border-orange-500"
                  : "border-gray-200"
              } ${item.stock === 0 && "cursor-not-allowed opacity-40"}`}
            >
              {item.size}
            </button>
          ))}
          <p className="mt-3 text-sm text-gray-500">
            Stock:{" "}
            <span className="font-medium">{selectedSize?.stock ?? 0}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
          className="flex h-11 w-5 items-center justify-center text-lg transition hover:bg-gray-100 active:scale-95"
        >
          -
        </button>

        <span className="w-8 text-center">{selectedQuantity}</span>

        <button
          onClick={() =>
            setSelectedQuantity((prev) =>
              Math.min(selectedSize.stock, prev + 1),
            )
          }
          className="flex h-11 w-5 items-center justify-center text-lg transition hover:bg-gray-100 active:scale-95"
        >
          +
        </button>
      </div>

      <Button
        disabled={selectedSize?.stock === 0}
        onClick={handleAddToCart}
        className="mt-5 h-12 rounded-none bg-black px-10 text-xs font-semibold uppercase text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {selectedSize?.stock === 0 ? "Out of Stock" : "Add To Cart"}
      </Button>

      <Separator className="mt-5 max-w-lg" />

      <ul className="mt-3 space-y-2 text-sm text-gray-500">
        <li>100% Original product.</li>
        <li>Cash on delivery is available on this product.</li>
        <li>Easy return and exchange policy within 7 days.</li>
      </ul>
    </div>
  );
}
