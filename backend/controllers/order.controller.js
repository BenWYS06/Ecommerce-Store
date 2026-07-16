import Order from "../models/order.model.js";

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select(
        "user products subtotal discount shippingFee totalAmount paymentMethod paymentStatus orderStatus createdAt",
      )
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch (error) {
    console.log("Error in getAdminOrders controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
