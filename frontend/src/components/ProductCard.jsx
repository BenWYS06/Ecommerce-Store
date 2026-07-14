import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`}>
      <article className="group cursor-pointer">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <h4 className="mt-3 text-xs font-medium text-gray-800">
          {product.name}
        </h4>

        <p className="mt-1 text-sm font-semibold text-gray-900">
          ${product.price}
        </p>
      </article>
    </Link>
  );
};

export default ProductCard;
