import hero1 from "../assets/image1.png";
import hero2 from "../assets/image2.png";
import hero3 from "../assets/image3.png";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-8 px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Headline and CTA */}
      <div className="mb-8 md:mb-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Powering Your Health with{" "}
          <span className="inline-flex items-center bg-yellow-100 rounded-full px-3 py-1 ml-2">
            <span className="text-xl mr-1">💊</span>
            Reminders
          </span>
        </h1>
        <button className="mt-6 bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-900 transition text-base sm:text-lg">
          Get Started
          <span className="ml-2 text-lg">→</span>
        </button>
      </div>
      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl overflow-hidden shadow-lg relative">
          <img src={hero1} alt="Smart Monitoring" className="object-cover w-full h-28 sm:h-40" />
          <span className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Smart Monitoring
          </span>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg relative">
          <img src={hero2} alt="Seamless Reminders" className="object-cover w-full h-28 sm:h-40" />
          <span className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Seamless Reminders
          </span>
        </div>
        <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg relative mt-3 sm:mt-4">
          <img src={hero3} alt="Long Term Health" className="object-cover w-full h-28 sm:h-40" />
          <span className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Long Term Health
          </span>
        </div>
      </div>
    </section>
  );
}
