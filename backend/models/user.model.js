import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    provider: {
      type: String,
      enum: ["local", "google", "github", "facebook"],
      default: "local",
    },

    googleId: {
      type: String,
      default: "",
    },

    githubId: {
      type: String,
      default: "",
    },

    facebookId: {
      type: String,
      default: "",
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        size: String,

        color: String,

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        fullName: String,

        phone: String,

        province: String,

        district: String,

        ward: String,

        address: String,

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Hash password
userSchema.pre("save", async function (next) {
  if (this.provider !== "local") return next();

  if (!this.isModified("password")) return next();

  if (!this.password || this.password.length < 6) {
    return next(new Error("Password must be at least 6 characters"));
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
