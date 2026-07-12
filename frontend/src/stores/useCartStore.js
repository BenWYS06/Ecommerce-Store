import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { SHIPPING_FEE } from "@/components/cart/CartTotals";

export const useCartStore = create((set, get) => ({
  cart: [],
  selectedItems: [],

  total: 0,
  subtotal: 0,
  coupon: null,
  isCouponApplied: false,
  myCoupon: null,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ myCoupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const { subtotal } = get();

      const res = await axios.post("/coupons/validate", {
        code,
        totalAmount: subtotal,
      });

      set({
        coupon: res.data,
        isCouponApplied: true,
      });

      get().calculateTotals();

      toast.success("Coupon applied");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");

      const cart = res.data.cartItems.map((item) => ({
        ...item,
        selected: false,
      }));

      set({ cart });

      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });

      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  addToCart: async (product, size, color, quantity) => {
    try {
      await axios.post("/cart", {
        productId: product._id,
        size,
        color,
        quantity,
      });

      toast.success("Product added to cart");

      get().getCartItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  },
  removeFromCart: async (productId, size, color) => {
    try {
      await axios.delete("/cart", {
        data: {
          productId,
          size,
          color,
        },
      });

      set((state) => ({
        cart: state.cart.filter(
          (item) =>
            !(
              item._id === productId &&
              item.size === size &&
              item.color === color
            ),
        ),
      }));

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },
  updateQuantity: async (productId, size, color, quantity) => {
    try {
      await axios.put(`/cart/${productId}`, {
        size,
        color,
        quantity,
      });

      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item,
        ),
      }));

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  toggleSelected: (productId, size, color) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === productId && item.size === size && item.color === color
          ? { ...item, selected: !item.selected }
          : item,
      ),
    }));

    get().calculateTotals();
  },

  calculateTotals: () => {
    const { cart, coupon } = get();

    const selectedItems = cart.filter((item) => item.selected);

    const subtotal = selectedItems.reduce((sum, item) => {
      const price = item.discountPrice > 0 ? item.discountPrice : item.price;

      return sum + price * item.quantity;
    }, 0);

    let total = subtotal + SHIPPING_FEE;

    if (coupon) {
      total -= total * (coupon.discountPercentage / 100);
    }

    set({
      selectedItems,
      subtotal,
      total,
    });
  },
}));
