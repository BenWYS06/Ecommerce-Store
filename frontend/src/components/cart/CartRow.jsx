import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

const CartRow = ({ item }) => {
  const { updateQuantity, removeFromCart, toggleSelected } = useCartStore();

  const price = item.discountPrice > 0 ? item.discountPrice : item.price;

  const handleQuantityChange = (event) => {
    const quantity = Number(event.target.value);

    if (quantity < 1) return;

    updateQuantity(item._id, item.size, item.color, quantity);
  };

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-gray-200 py-6 md:grid-cols-[1fr_140px_40px]">
      <div className="flex gap-5 items-center ">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelected(item._id, item.size, item.color)}
          className="h-5 w-5 cursor-pointer accent-black"
        />
        <img
          src={item.images[0]}
          alt={item.name}
          className="h-28 w-24 bg-gray-100 object-cover"
        />

        <div>
          <h3 className="text-sm font-semibold text-gray-700 md:text-base">
            {item.name}
          </h3>

          <div className="mt-4 flex items-center gap-4">
            <p className="text-base font-medium text-gray-700">${price}</p>

            {item.size && (
              <span className="flex h-9 min-w-9 items-center justify-center border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                {item.size}
              </span>
            )}
          </div>

          {item.color && (
            <p className="mt-3 text-sm text-gray-500">Color: {item.color}</p>
          )}
        </div>
      </div>

      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={handleQuantityChange}
        className="h-10 w-24 border border-gray-300 px-3 text-sm outline-none focus:border-black"
      />

      <button
        type="button"
        onClick={() => removeFromCart(item._id, item.size, item.color)}
        className="justify-self-end text-gray-500 transition hover:text-red-500"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartRow;
