import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "#about" },
    { name: "Features", to: "#features" },
    { name: "Contact", to: "#contact" },
  ];

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            Medication Reminder
          </span>
        </div>

        {/* Desktop Nav Links className="text-slate-700 hover:text-teal-700 font-medium transition"  */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/home" className="text-slate-700 hover:text-teal-700 font-medium transition">Home</Link>  
          <Link to="/about" className="text-slate-700 hover:text-teal-700 font-medium transition">About</Link>  
          <Link to="/features" className="text-slate-700 hover:text-teal-700 font-medium transition">Features</Link>  
          <Link to="/contact" className="text-slate-700 hover:text-teal-700 font-medium transition">Contact</Link>  
          <Link
            to="/login"
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Sign Up
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden flex items-center text-2xl text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Dropdown Menu for Mobile */}
      {open && (
        <div className="md:hidden absolute right-6 mt-2 bg-white rounded-lg shadow-lg py-2 w-48 text-center border border-gray-100">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.to}
              className="block px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium transition"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/login"
            className="block px-4 py-2 text-teal-700 font-semibold hover:bg-teal-50"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 text-blue-700 font-semibold hover:bg-blue-50"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
