import Newsletter from "../models/newsletter.model.js";
import { sendSubscribeEmail } from "../emails/emailHandlers.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const user = req.user;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already subscribed",
      });
    }

    await sendSubscribeEmail(email, user.name, process.env.CLIENT_URL);

    await Newsletter.create({
      email,
    });
    res.status(201).json({
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
