import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

export default function Login() {
  const [toast, setToast] = useState(null);
  const [value, setValue] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [displayText, setDisplayText] = useState("Let's get you in");
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
    setLoading(true);

    api
      .post("/login", value, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          showToast("Login Successful!", "success");
          setTimeout(() => {
            navigate(res.data.is_admin ? "/dashboard" : "/profile");
          }, 500);
        } else {
          showToast("Login Failed", "error");
        }
      })
      .catch(() => showToast("Login Failed", "error"))
      .finally(() => setLoading(false));
  };

  const logoClasses = `w-35 h-35 bg-white rounded-full flex items-center justify-center transition-transform duration-500 
    ${isCardHovered ? "scale-125 translate-y-2 rotate-12" : ""}`;

  const cardClasses = `bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transform transition-all duration-300`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fff1da] via-[#8cecff] to-[#0486ba]">
      <div className="w-full max-w-md relative z-10">
        <div
          className={cardClasses}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div className="text-center mb-6">
            <div className="w-44 h-44 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-all duration-500">
              <div className={logoClasses}>
                <img src="/logo.png" alt="Ubud Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Hi Buddy!</h1>
            <p className="text-gray-600 min-h-[24px]">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={value.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={value.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
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
