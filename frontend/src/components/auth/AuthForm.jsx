import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import FacebookButton from "./FacebookButton";
import GithubButton from "./GithubButton";
import { useUserStore } from "@/stores/useUserStore";

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const { login, signup, loading } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    let success;

    if (isLogin) {
      success = await login({
        email: formData.email,
        password: formData.password,
      });
    } else {
      success = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    }

    if (success) {
      navigate("/");
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <h3 className="font-serif text-4xl tracking-wide text-black">
              {isLogin ? "Login" : "Sign Up"}
            </h3>

            <span className="h-px w-12 bg-gray-700" />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <input
                type="text"
                autoComplete="name"
                placeholder="Name"
                className={`h-11 w-full border px-3 outline-none text-black ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }}
              />

              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              className={`h-11 w-full border px-3 outline-none text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });

                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }}
            />

            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="Password"
              className={`h-11 w-full border px-3 outline-none text-black ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.password}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  password: e.target.value,
                });

                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }}
            />

            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                className={`h-11 w-full border px-3 outline-none text-black ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }}
              />

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-500">
            {isLogin ? (
              <>
                <button
                  type="button"
                  className="text-sm text-gray-500 transition hover:text-black"
                >
                  Forgot password?
                </button>

                <Link
                  to="/signup"
                  className="text-sm text-gray-500 transition hover:text-black"
                >
                  Create account
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-500 transition hover:text-black"
              >
                Already have an account?
              </Link>
            )}
          </div>

          <button
            disabled={loading}
            className={`h-11 w-full text-white transition ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="text-xs uppercase tracking-widest text-gray-400">
              Or
            </span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <GoogleButton />
          <FacebookButton />
          <GithubButton />
        </form>
      </div>
    </section>
  );
};

export default AuthForm;
