import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const productIds = req.user.cartItems.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const cartItems = req.user.cartItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString(),
      );

      return {
        ...product.toJSON(),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      };
    });

    res.json({ cartItems });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    const user = req.user;

    const existingItem = user.cartItems.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({
        product: productId,
        size,
        color,
        quantity,
      });
    }

    await user.save();

    res.json({ cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) =>
          !(
            item.product.toString() === productId &&
            item.size === size &&
            item.color === color
          ),
      );
    }

    await user.save();

    res.json({ cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { size, color, quantity } = req.body;

    const user = req.user;

    const item = user.cartItems.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (quantity <= 0) {
      user.cartItems = user.cartItems.filter(
        (cartItem) =>
          !(
            cartItem.product.toString() === productId &&
            cartItem.size === size &&
            cartItem.color === color
          ),
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();

    res.json({ cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
