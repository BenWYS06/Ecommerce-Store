import React from "react";

const Footer = () => {
  return (
    <footer className="pt-20 text-gray-700">
      <div className="mx-auto px-20">
        <div className="grid gap-12 border-b border-gray-200 pb-10 md:grid-cols-[4fr_2fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-wider text-black">
              FOREVER<span className="text-pink-500">.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-500">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase text-gray-800">
              Company
            </h4>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>Home</li>
              <li>About us</li>
              <li>Delivery</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase text-gray-800">
              Get In Touch
            </h4>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>+1-212-456-7890</li>
              <li>ben@gmail.com</li>
            </ul>
          </div>
        </div>

        <p className="py-5 text-center text-sm text-gray-500">
          Copyright 2024 © Ben.dev - All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
