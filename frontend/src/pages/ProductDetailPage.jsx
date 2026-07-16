import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductDescriptionTabs from "../components/ProductDescriptionTabs";
import ProductSection from "@/components/ProductSection";

const ProductDetailPage = () => {
  const { fetchProductById, product, fetchRelatedProducts, relatedProducts } =
    useProductStore();

  const { id } = useParams();

  useEffect(() => {
    fetchProductById(id);
    fetchRelatedProducts(id);
  }, [fetchProductById, id, fetchRelatedProducts]);

  if (!product || !relatedProducts) {
    return <div>Loading...</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-gray-800">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} name={product.name} />

        <ProductInfo product={product} />
      </section>

      <ProductDescriptionTabs product={product} />

      <ProductSection
        title={
          <>
            Related <span className="font-bold text-gray-800">Products</span>
          </>
        }
        subtitle=""
        products={relatedProducts}
      />
    </main>
  );
};

export default ProductDetailPage;
