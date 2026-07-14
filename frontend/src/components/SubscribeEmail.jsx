import { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

const SubscribeEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/newsletter/subscribe", {
        email,
      });

      toast.success(res.data.message || "Subscribed successfully!");

      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 text-center">
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-2xl font-bold text-gray-800">Subscribe now</h3>

        <Mail className="h-7 w-7 text-gray-700" />
      </div>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
        Join our newsletter to receive exclusive promotions, new arrivals,
        seasonal sales, and members-only offers delivered straight to your
        inbox.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="mx-auto mt-8 flex max-w-xl overflow-hidden border border-gray-300"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-8 text-xs font-semibold uppercase text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-500"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Loading..." : "Subscribe"}
        </button>
      </form>
    </section>
  );
};

export default SubscribeEmail;
