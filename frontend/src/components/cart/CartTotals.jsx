import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const stripePublishKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
const stripePromise = stripePublishKey ? loadStripe(stripePublishKey) : null;

export const SHIPPING_FEE = 10;

const CartTotals = () => {
  const {
    selectedItems,
    subtotal,
    total,
    coupon,
    isCouponApplied,
    getMyCoupon,
    applyCoupon,
    removeCoupon,
    myCoupon,
  } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, []);

  const discount =
    coupon && isCouponApplied ? subtotal + SHIPPING_FEE - total : 0;

  const displayTotal = total;

  const handleCheckout = async () => {
    if (!stripePromise) {
      toast.error("Missing Stripe publishable key");
      return;
    }

    const stripe = await stripePromise;

    const res = await axios.post("/payments/create-checkout-session", {
      products: selectedItems,
      couponCode: coupon ? coupon.code : null,
    });

    const result = await stripe.redirectToCheckout({
      sessionId: res.data.id,
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <section className="ml-auto mt-14 w-full max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl uppercase tracking-wide text-gray-500">
          Cart <span className="font-bold text-gray-800">Totals</span>
        </h2>
        <span className="h-px w-12 bg-gray-700" />
      </div>

      {myCoupon && (
        <div className="mb-6 rounded border border-gray-200 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Your Coupon
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{myCoupon.code}</p>

              <p className="text-sm text-gray-500">
                Save {myCoupon.discountPercentage}%
              </p>
            </div>

            {isCouponApplied ? (
              <button
                onClick={removeCoupon}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => applyCoupon(myCoupon.code)}
                className="rounded bg-black px-4 py-2 text-xs text-white hover:bg-gray-800"
              >
                Apply
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 text-sm">
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-600">Shipping Fee</span>
          <span className="font-medium text-gray-800">
            ${SHIPPING_FEE.toFixed(2)}
          </span>
        </div>

        {isCouponApplied && (
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-600">Discount</span>

            <span className="font-medium text-green-600">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>${displayTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="mt-8 h-12 w-full bg-black px-8 text-xs font-semibold uppercase text-white transition hover:bg-gray-800 md:w-auto"
      >
        Proceed To Checkout
      </button>
    </section>
  );
};

export default CartTotals;
