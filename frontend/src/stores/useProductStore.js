import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  featuredProducts: [],
  relatedProducts: [],
  latestProducts: [],
  searchProducts: [],
  product: null,
  searchLoading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/${id}`);
      set({ product: response.data.product, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchSearchProducts: async (query) => {
    if (!query.trim()) {
      return set({
        searchProducts: [],
        searchLoading: false,
      });
    }

    set({
      searchLoading: true,
      searchProducts: [],
    });

    try {
      const response = await axios.get(`/products/search?q=${query}`);

      set({
        searchProducts: response.data.products,
        searchLoading: false,
      });
    } catch (error) {
      set({
        searchProducts: [],
        searchLoading: false,
      });

      toast.error(error.response?.data?.message || "Failed to search products");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.updateProduct }
            : product,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });

    try {
      const response = await axios.get("/products/featured");

      set({
        featuredProducts: response.data.featuredProducts,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
      });

      toast.error(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
  fetchLatestProducts: async () => {
    set({ loading: true });

    try {
      const response = await axios.get("/products/latest");

      set({
        latestProducts: response.data.latestProducts,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
      });

      toast.error(
        error.response?.data?.message || "Failed to fetch latest products",
      );
    }
  },
  fetchRelatedProducts: async (id) => {
    set({ loading: true });

    try {
      const response = await axios.get(`/products/related/${id}`);

      set({
        relatedProducts: response.data.relatedProducts,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
      });

      toast.error(
        error.response?.data?.message || "Failed to fetch related products",
      );
    }
  },
  updateCurrentProductRating: ({ rating, numReviews }) => {
    set((state) => ({
      product: state.product
        ? {
            ...state.product,
            rating,
            numReviews,
          }
        : state.product,
    }));
  },
}));
