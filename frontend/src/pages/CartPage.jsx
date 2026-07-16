import { useCartStore } from "@/stores/useCartStore";
import SectionTitle from "@/components/SectionTitle";
import EmptyCart from "@/components/cart/EmptyCart";
import CartRow from "@/components/cart/CartRow";
import CartTotals from "@/components/cart/CartTotals";

const CartPage = () => {
  const { cart } = useCartStore();

  if (!cart.length) {
    return <EmptyCart />;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-gray-800">
      <SectionTitle
        title={
          <>
            Your <span className="text-black">Cart</span>
          </>
        }
      />

      <div className="mt-8 border-t border-gray-200">
        {cart.map((item) => (
          <CartRow key={`${item._id}-${item.size}-${item.color}`} item={item} />
        ))}
      </div>

      <CartTotals />
    </main>
  );
};

export default CartPage;
