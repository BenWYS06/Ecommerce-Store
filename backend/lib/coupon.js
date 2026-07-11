import Coupon from "../models/coupon.model.js";

export const createWelcomeCoupon = async (userId) => {
  return await Coupon.create({
    code: "WELCOME" + Math.random().toString(36).substring(2, 8).toUpperCase(),

    description: "Welcome coupon for new member",

    discountPercentage: 20,

    minimumAmount: 50,

    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

    user: userId,
  });
};
