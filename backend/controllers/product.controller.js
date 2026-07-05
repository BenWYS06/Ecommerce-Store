import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import slugify from "slugify";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json({
        featuredProducts: JSON.parse(featuredProducts),
      });
    }

    // if not in redis, fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!featuredProducts.length) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json({ featuredProducts });
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    let latestProducts = await redis.get("latest_products");

    // Return cached data if available
    if (latestProducts) {
      return res.json({
        latestProducts: JSON.parse(latestProducts),
      });
    }

    // Fetch latest 5 products from MongoDB
    latestProducts = await Product.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(10)
      .lean();

    if (!latestProducts.length) {
      return res.status(404).json({
        message: "No latest products found",
      });
    }

    // Cache the result
    await redis.set("latest_products", JSON.stringify(latestProducts));

    res.json({ latestProducts });
  } catch (error) {
    console.log("Error in getLatestProducts controller", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Find current product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find products in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id }, // exclude current product
    })
      .limit(5)
      .lean();

    res.json({ relatedProducts });
  } catch (error) {
    console.log("Error in getRelatedProducts:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice = 0,
      images = [],
      sizes = [],
      colors = [],
      stock = 0,
      tags = [],
      isFeatured = false,
    } = req.body;

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        if (image.startsWith("http")) return image;

        const { secure_url } = await cloudinary.uploader.upload(image, {
          folder: "products",
        });

        return secure_url;
      }),
    );

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      brand,
      category,
      price,
      discountPrice,
      images: uploadedImages,
      sizes,
      colors,
      stock,
      tags,
      isFeatured,
    });

    await deleteLatestProductsCache();

    res.status(201).json({ product });
  } catch (error) {
    console.log("Error in createProduct:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Promise.all(
      product.images.map(async (image) => {
        const publicId = image.split("/").pop().split(".")[0];

        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.log("error deleting image from cloudinary", error);
        }
      }),
    );

    await Product.findByIdAndDelete(req.params.id);
    await deleteLatestProductsCache();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.json({ product });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSearchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      isPublished: true,
      $or: {
        name: {
          $regex: q,
          $options: "i",
        },
      },
    })
      .limit(8)
      .lean();

    res.json({ products });
  } catch (error) {
    console.log("Error in getSearchProducts:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json({ updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}

async function deleteLatestProductsCache() {
  try {
    await redis.del("latest_products");
  } catch (error) {
    console.log("Error deleting latest products cache");
  }
}
