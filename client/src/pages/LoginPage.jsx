import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [step, setStep] = useState("login"); // 'login' | 'otp' | 'success'
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login (send OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setInfo("OTP sent to your email. Please check your inbox/spam.");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  // Handle OTP verification (get JWT)
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await fetch("http://localhost:8000/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setInfo("Login successful!");
        setStep("success");
        // Save JWT token (localStorage/session/cookie as per your app)
        localStorage.setItem("token", data.token);
        // Redirect to dashboard or home after a short delay
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-teal-100 to-white px-2">
      <div className="relative w-full max-w-lg">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-200 rounded-full opacity-30 z-0"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 z-0"></div>
        {/* Card */}
        <div className="relative z-10 bg-white/90 shadow-2xl rounded-3xl p-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-teal-400 to-blue-400 shadow-lg mb-2">
              <span className="text-3xl">🔑</span>
            </div>
            <h2 className="text-3xl font-extrabold text-teal-700 mb-1 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center">
              Login to access your medication reminders!
            </p>
          </div>

          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          {info && <div className="mb-4 text-green-600 text-center">{info}</div>}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Login
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Enter OTP sent to your email
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Verify OTP
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center text-green-700 text-lg">
              Login successful! Redirecting...
            </div>
          )}

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-700 underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
