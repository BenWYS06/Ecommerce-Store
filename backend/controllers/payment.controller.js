import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { stripe } from "../lib/stripe.js";

const SHIPPING_FEE = 10;

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let subtotalAmount = 0;

    const lineItems = products.map((product) => {
      const price =
        product.discountPrice > 0 ? product.discountPrice : product.price;
      const amount = Math.round(price * 100); // stripe wants cents
      subtotalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images?.length ? [product.images[0]] : [],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    let discountAmount = 0;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        discountAmount = Math.round(
          (subtotalAmount * coupon.discountPercentage) / 100,
        );
      }
    }

    const shippingAmount = Math.round(SHIPPING_FEE * 100);
    const totalAmount = subtotalAmount - discountAmount + shippingAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...lineItems,
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping Fee",
            },
            unit_amount: shippingAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.discountPrice > 0 ? p.discountPrice : p.price,
            size: p.size || "",
            color: p.color || "",
          })),
        ),
        subtotal: (subtotalAmount / 100).toString(),
        discount: (discountAmount / 100).toString(),
        shippingFee: SHIPPING_FEE.toString(),
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  // just for fallback because maybe webhook called later than show successPage
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const order = await createOrderFromCheckoutSession(session);

      return res.status(200).json({
        success: true,
        message: "Payment successful.",
        orderId: order._id,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Payment is not completed." });
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res
      .status(500)
      .json({
        message: "Error processing successful checkout",
        error: error.message,
      });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      await createOrderFromCheckoutSession(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(500).json({ message: "Webhook handler failed" });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}

async function createOrderFromCheckoutSession(session) {
  const existingOrder = await Order.findOne({
    stripeSessionId: session.id,
  });

  if (existingOrder) return existingOrder;

  if (session.metadata.couponCode) {
    await Coupon.findOneAndUpdate(
      {
        code: session.metadata.couponCode,
        userId: session.metadata.userId,
      },
      {
        isActive: false,
      },
    );
  }

  const products = JSON.parse(session.metadata.products);

  const order = await Order.create({
    user: session.metadata.userId,
    products: products.map((product) => ({
      product: product.id,
      quantity: product.quantity,
      price: product.price,
      size: product.size,
      color: product.color,
    })),
    subtotal: Number(session.metadata.subtotal),
    discount: Number(session.metadata.discount),
    shippingFee: Number(session.metadata.shippingFee),
    totalAmount: session.amount_total / 100,
    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    stripeSessionId: session.id,
  });

  await User.findByIdAndUpdate(session.metadata.userId, {
    $set: { cartItems: [] },
  });

  return order;
}
