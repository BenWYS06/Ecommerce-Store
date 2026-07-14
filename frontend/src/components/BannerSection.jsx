import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/constants/banners";

const BannerSection = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative my-16">
      <img
        src={banners[current].image}
        alt={banners[current].title}
        className="h-[220px] md:h-[350px] lg:h-[450px] w-full object-cover animate-fade"
      />

      {/* Left */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow hover:bg-white"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow hover:bg-white"
      >
        <ChevronRight size={22} />
      </button>

      {/* Indicator */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition ${
              current === index ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSection;
