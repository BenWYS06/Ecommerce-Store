import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const myCoupon = await Coupon.findOne({
      user: req.user._id,
      isActive: true,
      used: false,
    });

    if (!myCoupon) {
      return res.json(null);
    }

    if (myCoupon.expirationDate < new Date()) {
      myCoupon.isActive = false;
      await myCoupon.save();

      return res.json(null);
    }

    res.json(myCoupon);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      user: req.user._id,
      isActive: true,
      used: false,
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();

      return res.status(400).json({
        message: "Coupon expired",
      });
    }

    if (totalAmount < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Minimum order is $${coupon.minimumAmount}`,
      });
    }

    res.json(coupon);
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
