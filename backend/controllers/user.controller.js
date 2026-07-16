import User from "../models/user.model.js";

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone role provider createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users });
  } catch (error) {
    console.log("Error in getAdminUsers controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
