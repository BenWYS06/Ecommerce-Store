import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import BrandSection from "@/components/BrandSection";
import Pagination from "@/components/Pagination";

const PRODUCTS_PER_PAGE = 16;

const ProductPage = () => {
  const { brandSlug } = useParams();
  const { fetchAllProducts, products } = useProductStore();
  const productGridRef = useRef(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("low-high");
  const [currentPage, setCurrentPage] = useState(1);
  const selectedBrands = useMemo(
    () => (brandSlug ? brandSlug.split("&").filter(Boolean) : []),
    [brandSlug],
  );

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const toggleValue = (value, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrands.length > 0) {
      result = result.filter((product) => {
        const productBrandSlug = product.brand
          ?.toLowerCase()
          .replace(/\s+/g, "-");

        return selectedBrands.includes(productBrandSlug);
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedBrands, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedCategories, sortBy]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setCurrentPage(page);
    productGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-1 text-gray-800">
      <BrandSection />
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside>
          <h2 className="mb-4 text-xl font-medium uppercase">Filters</h2>

          <FilterBox title="Categories">
            {["men", "women", "kids"].map((category) => (
              <div key={category} className="flex items-center gap-3">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() =>
                    toggleValue(category, setSelectedCategories)
                  }
                />
                <label htmlFor={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              </div>
            ))}
          </FilterBox>
        </aside>

        <section ref={productGridRef} className="scroll-mt-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl uppercase tracking-wide text-gray-500">
                All <span className="font-bold text-gray-800">Collections</span>
              </h1>
              <span className="h-px w-12 bg-gray-700" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none sm:w-56"
            >
              <option value="low-high">Sort by: Price: Low To High</option>
              <option value="high-low">Sort by: Price: High To Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="py-16 text-center text-sm text-gray-500">
              No products found.
            </p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </div>
    </main>
  );
};

function FilterBox({ title, children }) {
  return (
    <div className="mb-4 border border-gray-300 p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase text-gray-700">
        {title}
      </h3>

      <div className="space-y-3">{children}</div>
    </div>
  );
}
export default ProductPage;
