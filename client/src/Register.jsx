import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

export default function Register() {
  const [toast, setToast] = useState(null);
  const [value, setValue] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.password !== value.confirmPassword) {
      showToast("Passwords don't match!", "error");
      return;
    }

    setLoading(true);
    api
      .post("/register", value)
      .then((res) => {
        if (res.status === 201) {
          showToast("Registration Successful", "success");
          setTimeout(() => navigate("/login"), 1500);
        } else showToast("Registration Failed", "error");
      })
      .catch(() => showToast("Registration Failed", "error"))
      .finally(() => setLoading(false));
  };

  const logoClasses = "w-full h-full";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#8cecff] to-[#03597b]">
       <div className="w-72 sm:w-80 md:w-96 max-w-md">
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div
            className={`w-40 h-40 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-all duration-500
              ${isCardHovered ? "scale-110 -rotate-12" : ""}`}
          >
            <div className={logoClasses}>
              <img src="/logo.png" alt="Ubud Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Welcome to Ubud</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="username" placeholder="Username" value={value.username} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200" />
            <input type="email" name="email" placeholder="Email" value={value.email} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200" />
            <input type="password" name="password" placeholder="Password" value={value.password} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={value.confirmPassword} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200" />
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl text-white font-medium text-lg
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}