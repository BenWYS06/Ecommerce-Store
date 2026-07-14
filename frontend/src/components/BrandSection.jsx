import { Link, useParams } from "react-router-dom";
import { brands } from "@/constants/brands";

const BrandSection = () => {
  const { brandSlug } = useParams();
  const selectedBrands = brandSlug ? brandSlug.split("&").filter(Boolean) : [];

  const getBrandPath = (slug) => {
    const nextBrands = selectedBrands.includes(slug)
      ? selectedBrands.filter((brand) => brand !== slug)
      : [...selectedBrands, slug];

    return nextBrands.length > 0
      ? `/products/brand/${nextBrands.join("&")}`
      : "/products";
  };

  return (
    <section className="my-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {brands.map((brand) => {
            const isActive = selectedBrands.includes(brand.slug);

            return (
              <Link
                key={brand.id}
                to={getBrandPath(brand.slug)}
                className={`group flex h-28 items-center justify-center rounded-xl border-2 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg ${
                  isActive
                    ? "-translate-y-1 border-black shadow-lg"
                    : "border-transparent bg-white"
                }`}
              >
                <div className="flex h-16 w-24 items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
