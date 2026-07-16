import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipping",
  "Delivered",
  "Cancelled",
];

const PAYMENT_METHODS = ["Stripe", "COD"];

export const normalizeAnalyticsRange = (range) =>
  Object.hasOwn(RANGE_DAYS, range) ? range : "90d";

const getDateRange = (range) => {
  const days = RANGE_DAYS[range];
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  startDate.setUTCHours(0, 0, 0, 0);

  return { days, startDate, endDate };
};

const fillMissingDates = (dailyData, days, startDate) => {
  const valuesByDate = new Map(
    dailyData.map((item) => [
      item._id,
      { revenue: item.revenue, orders: item.orders },
    ]),
  );

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + index);
    const dateKey = date.toISOString().split("T")[0];
    const values = valuesByDate.get(dateKey);

    return {
      date: dateKey,
      revenue: values?.revenue || 0,
      orders: values?.orders || 0,
    };
  });
};

const includeMissingGroups = (groups, keys, keyName) => {
  const counts = new Map(groups.map((group) => [group._id, group.count]));

  return keys.map((key) => ({
    [keyName]: key,
    count: counts.get(key) || 0,
  }));
};

export const getDashboardAnalytics = async (requestedRange) => {
  const range = normalizeAnalyticsRange(requestedRange);
  const { days, startDate, endDate } = getDateRange(range);

  const [
    orderSummary,
    totalCustomers,
    totalProducts,
    dailyData,
    recentOrderDocuments,
    statusGroups,
    categoryGroups,
    paymentGroups,
  ] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] },
          },
        },
      },
    ]),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "UTC",
            },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.find()
      .select(
        "user totalAmount paymentMethod paymentStatus orderStatus createdAt",
      )
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: Product.collection.name,
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: { $ifNull: ["$productDetails.category", "Uncategorized"] },
          quantity: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      { $sort: { quantity: -1 } },
    ]),
    Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]),
  ]);

  const totals = orderSummary[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
  };

  return {
    summary: {
      totalRevenue: totals.totalRevenue || 0,
      totalOrders: totals.totalOrders || 0,
      totalCustomers,
      totalProducts,
    },
    dailyPerformance: fillMissingDates(dailyData, days, startDate),
    recentOrders: recentOrderDocuments.map((order) => ({
      _id: order._id,
      customerName: order.user?.name || "Unknown customer",
      totalAmount: order.totalAmount || 0,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    })),
    orderStatusBreakdown: includeMissingGroups(
      statusGroups,
      ORDER_STATUSES,
      "status",
    ),
    salesByCategory: categoryGroups.map((group) => ({
      category: group._id,
      quantity: group.quantity || 0,
      revenue: group.revenue || 0,
    })),
    paymentMethodBreakdown: includeMissingGroups(
      paymentGroups,
      PAYMENT_METHODS,
      "method",
    ),
    fulfillmentRate:
      totals.totalOrders > 0
        ? totals.deliveredOrders / totals.totalOrders
        : 0,
  };
};
