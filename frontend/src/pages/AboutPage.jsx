import { ShieldCheck, Truck, CreditCard, Star } from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import SubscribeEmail from "@/components/SubscribeEmail";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "Every product is carefully selected and inspected to ensure the highest quality before reaching our customers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Reliable shipping with order tracking, ensuring your purchases arrive safely and on time.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Shop confidently with secure Stripe payments and industry-standard encryption.",
  },
  {
    icon: Star,
    title: "Trusted Experience",
    description:
      "Verified customer reviews, responsive support, and a seamless shopping experience from start to finish.",
  },
];

const stats = [
  {
    value: "500+",
    label: "Products",
  },
  {
    value: "5K+",
    label: "Customers",
  },
  {
    value: "98%",
    label: "Positive Reviews",
  },
  {
    value: "24/7",
    label: "Support",
  },
];

const AboutPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <SectionTitle
        title={
          <>
            About <span className="font-bold text-gray-800">BenShop</span>
          </>
        }
      />

      <section className="grid items-center gap-16 lg:grid-cols-2">
        <img
          src="/about.jpg"
          alt="About BenShop"
          className="h-full w-full object-cover"
        />

        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Premium Fashion For Everyday Life
          </h2>

          <p className="mt-6 leading-8 text-gray-600">
            BenShop was created with one simple goal — making premium fashion
            accessible through a modern and enjoyable online shopping
            experience.
          </p>

          <p className="mt-5 leading-8 text-gray-600">
            We carefully curate every collection, focusing on quality, comfort,
            and timeless design while providing secure payments, exclusive
            promotions, verified reviews, and fast delivery.
          </p>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>

            <p className="mt-4 leading-8 text-gray-600">
              To inspire confidence through fashion while delivering a seamless
              shopping journey from discovery to checkout and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24 grid grid-cols-2 gap-8 border-y py-14 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>

            <p className="mt-2 text-sm uppercase tracking-wider text-gray-500">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-24">
        <SectionTitle
          title={
            <>
              Why Choose <span className="font-bold text-gray-800">Us</span>
            </>
          }
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="border p-8 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon size={34} className="text-gray-800" />

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-24 rounded bg-gray-50 px-8 py-16 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Ready To Refresh Your Wardrobe?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
          Discover premium collections carefully selected for quality, comfort,
          and timeless style.
        </p>

        <a
          href="/products"
          className="mt-10 inline-block bg-black px-10 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800"
        >
          Shop Collection
        </a>
      </section>
      <SubscribeEmail />
    </main>
  );
};

export default AboutPage;
