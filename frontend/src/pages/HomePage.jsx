import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { RefreshCcw, RotateCcw, Headphones } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import BrandSection from "@/components/BrandSection";
import ProductSection from "@/components/ProductSection";
import BannerSection from "@/components/BannerSection";
import SubscribeEmail from "@/components/SubscribeEmail";

const HomePage = () => {
  const {
    fetchFeaturedProducts,
    fetchLatestProducts,
    featuredProducts,
    latestProducts,
    loading,
  } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchLatestProducts();
  }, [fetchFeaturedProducts, fetchLatestProducts]);

  if (!featuredProducts || !latestProducts || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 ">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid min-h-[440px] border md:grid-cols-2">
          <div className="flex items-center justify-center px-8 py-16">
            <div>
              <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase text-gray-600">
                <span className="h-px w-12 bg-gray-600" />
                Our Bestsellers
              </div>

              <h2 className="font-serif text-5xl text-gray-700">
                Latest Arrivals
              </h2>

              <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase">
                Shop Now
                <span className="h-px w-10 bg-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-[#f8d4ce]">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900"
              alt="Fashion model"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </section>

        <BrandSection />

        <ProductSection
          title={
            <>
              Latest{" "}
              <span className="font-bold text-gray-800">Collections</span>
            </>
          }
          subtitle="Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the."
          products={latestProducts}
        />

        <ProductSection
          title={
            <>
              Best <span className="font-bold text-gray-800">Seller</span>
            </>
          }
          subtitle="Discover our best-selling products."
          products={featuredProducts}
        />

        <section className="grid gap-10 py-20 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <RefreshCcw
              size={34}
              strokeWidth={2.2}
              className="mb-4 text-black"
            />
            <h4 className="text-sm font-bold text-gray-800">
              Easy Exchange Policy
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              We offer hassle free exchange policy
            </p>
          </div>

          <div className="flex flex-col items-center">
            <RotateCcw
              size={34}
              strokeWidth={2.2}
              className="mb-4 text-black"
            />
            <h4 className="text-sm font-bold text-gray-800">
              7 Days Return Policy
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              We provide 7 days free return policy
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Headphones
              size={34}
              strokeWidth={2.2}
              className="mb-4 text-black"
            />
            <h4 className="text-sm font-bold text-gray-800">
              Best Customer Support
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              We provide 24/7 customer support
            </p>
          </div>
        </section>

        <SubscribeEmail />
      </main>
      <BannerSection />
    </div>
  );
};
export default HomePage;
