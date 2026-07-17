import {
  MapPin,
  Phone,
  Mail,
  Clock,
  BadgeCheck,
  PackageCheck,
  RefreshCcw,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";

import SectionTitle from "@/components/SectionTitle";
import SubscribeEmail from "@/components/SubscribeEmail";

const ContactPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <SectionTitle
        title={
          <>
            Contact <span className="font-bold text-gray-800">Us</span>
          </>
        }
      />

      <section className="grid items-center gap-16 lg:grid-cols-2">
        <img
          src="/contact.jpg"
          alt="Contact BenShop"
          className="h-[600px] w-full rounded-lg object-cover shadow-sm"
        />

        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            We&apos;d Love To Hear From You
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Whether you have a question about an order, shipping, payments,
            returns, or simply want to say hello, our team is always ready to
            help.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <MapPin size={20} className="text-gray-700" />
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Store Address
                </h4>

                <p className="mt-2 leading-7 text-gray-600">
                  123 Fashion Street
                  <br />
                  Can Tho City, Vietnam
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Phone size={20} className="text-gray-700" />
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Phone
                </h4>

                <p className="mt-2 leading-7 text-gray-600">+84 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Mail size={20} className="text-gray-700" />
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Email
                </h4>

                <p className="mt-2 leading-7 text-gray-600">
                  support@benshop.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Clock size={20} className="text-gray-700" />
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Business Hours
                </h4>

                <p className="mt-2 leading-7 text-gray-600">
                  Monday – Saturday
                  <br />
                  08:00 AM – 09:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/products"
              className="inline-block bg-black px-8 py-4 text-sm font-semibold uppercase text-white transition hover:bg-gray-800"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <SectionTitle
          title={
            <>
              Why Shop With <span className="font-bold text-gray-800">Us</span>
            </>
          }
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="border p-8">
            <BadgeCheck size={34} className="text-black" />
            <h3 className="mt-5 font-semibold">Secure Checkout</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Stripe-powered payments with industry-standard security.
            </p>
          </div>

          <div className="border p-8">
            <PackageCheck size={34} className="text-black" />
            <h3 className="mt-5 font-semibold">Fast Delivery</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Reliable shipping and order tracking for every purchase.
            </p>
          </div>

          <div className="border p-8">
            <RefreshCcw size={34} className="text-black" />
            <h3 className="mt-5 font-semibold">Easy Returns</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Hassle-free return policy for eligible orders.
            </p>
          </div>

          <div className="border p-8">
            <WalletCards size={34} className="text-black" />
            <h3 className="mt-5 font-semibold">Member Benefits</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Welcome coupons, exclusive promotions, newsletters, and verified
              reviews.
            </p>
          </div>
        </div>
      </section>

      <SubscribeEmail />
    </main>
  );
};

export default ContactPage;
