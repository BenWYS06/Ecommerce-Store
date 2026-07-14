import React from "react";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

const ProductSection = ({ title, subtitle, products }) => {
  return (
    <section className="py-10">
      <SectionTitle title={title} subtitle={subtitle} />

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
