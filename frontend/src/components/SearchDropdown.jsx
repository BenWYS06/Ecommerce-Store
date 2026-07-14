import React from "react";
import { Link } from "react-router-dom";

const SearchDropdown = ({ products, onSelect }) => {
  return (
    <div className="absolute left-0 top-full mt-3 w-full rounded-md border border-gray-200 bg-white shadow-lg">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          onClick={onSelect}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-14 w-14 rounded object-cover"
          />

          <div className="flex-1">
            <h4 className="line-clamp-1 text-sm font-medium">{product.name}</h4>

            <p className="mt-1 text-xs text-gray-500">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchDropdown;
