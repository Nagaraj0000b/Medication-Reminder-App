import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import About from "./About";
import Contact from "./Contact";
import Features from "./Features";
import Home from "./Home";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <HeroSection />

        {/* Test Dashboard Button */}
        {/* <div className="flex justify-center mt-10">
          <button
            className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-teal-700 transition text-lg"
            onClick={() => navigate("/dashboard")}
          >
            Test Dashboard
          </button>
        </div> */}

        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
