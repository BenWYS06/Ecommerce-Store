import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="py-24 text-center">
      <ShoppingBag size={70} className="mx-auto text-gray-300" />

      <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>

      <p className="mt-2 text-gray-500">
        Add some products to continue shopping.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block bg-black px-8 py-3 text-white"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
