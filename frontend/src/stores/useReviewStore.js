import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { useProductStore } from "./useProductStore";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  productId: null,
  loading: false,

  fetchReviews: async (productId) => {
    set({ loading: true, productId });

    try {
      const response = await axios.get(`/reviews/${productId}`);

      set({
        reviews: response.data,
        loading: false,
      });
    } catch (error) {
      set({ reviews: [], loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    }
  },

  createReview: async (data) => {
    if (!data.rating) {
      toast.error("Rating is required");
      return false;
    }

    if (!data.comment?.trim()) {
      toast.error("Comment is required");
      return false;
    }

    set({ loading: true });

    try {
      const response = await axios.post("/reviews", data);

      useProductStore.getState().updateCurrentProductRating({
        rating: response.data.rating,
        numReviews: response.data.numReviews,
      });

      await get().fetchReviews(data.productId);
      toast.success(response.data.message || "Review created successfully");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create review");
      return false;
    }
  },

  updateReview: async (id, data) => {
    if (!data.rating) {
      toast.error("Rating is required");
      return false;
    }

    if (!data.comment?.trim()) {
      toast.error("Comment is required");
      return false;
    }

    set({ loading: true });

    try {
      const response = await axios.put(`/reviews/${id}`, data);

      useProductStore.getState().updateCurrentProductRating({
        rating: response.data.rating,
        numReviews: response.data.numReviews,
      });

      await get().fetchReviews(get().productId);
      toast.success(response.data.message || "Review updated successfully");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update review");
      return false;
    }
  },

  deleteReview: async (id) => {
    set({ loading: true });

    try {
      const response = await axios.delete(`/reviews/${id}`);

      useProductStore.getState().updateCurrentProductRating({
        rating: response.data.rating,
        numReviews: response.data.numReviews,
      });

      await get().fetchReviews(get().productId);
      toast.success(response.data.message || "Review deleted successfully");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to delete review");
      return false;
    }
  },
}));
