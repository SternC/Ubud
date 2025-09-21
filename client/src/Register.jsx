import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [displayText, setDisplayText] = useState("");
  const fullText = "Sign up and be our buddy!";

  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value.password !== value.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    axios.post('http://localhost:5000/register', value)
      .then(res => {
        if (res.status === 201) {
          alert("Registration Successful");
          navigate("/login");
        } else {
          alert("Registration Failed");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Registration Failed");
      })
      .finally(() => setLoading(false));
  };

  const logoClasses = `w-32 h-32 bg-white rounded-full flex items-center justify-center transition-transform duration-500
    ${isCardHovered ? 'scale-125 -translate-y-2 -rotate-6' : ''}`;

  const cardClasses = `bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-500 scale-105`;

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#FFFBDE" }}>
      <div className="w-full max-w-md">
        <div
          className={cardClasses}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div className="text-center mb-6">
            {/* Logo */}
            <div className={`w-40 h-40 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-all duration-500
              ${isCardHovered ? 'scale-110 -rotate-12' : ''}`}>
              <div className={logoClasses}>
                <img src="/logo.png" alt="Ubud Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2 transition-colors duration-300 hover:text-blue-600 cursor-default">
              Welcome to Ubud
            </h1>
            <p className="text-gray-600 cursor-default min-h-[24px]">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="relative group">
              <input
                id="username"
                type="text"
                name="username"
                value={value.username}
                onChange={handleChange}
                placeholder="Name"
                required
                className="peer block w-full rounded-lg border border-gray-300 p-3 
                  focus:ring-4 focus:ring-blue-200 focus:border-blue-400 
                  transition-all duration-300 hover:border-blue-300 hover:shadow-md 
                  transform focus:scale-105 placeholder-transparent"
              />
              <label 
                htmlFor="username"
                className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:bg-white peer-focus:px-1 peer-valid:bg-white peer-valid:px-1"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                id="email"
                type="email"
                name="email"
                value={value.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="peer block w-full rounded-lg border border-gray-300 p-3 
                  focus:ring-4 focus:ring-blue-200 focus:border-blue-400 
                  transition-all duration-300 hover:border-blue-300 hover:shadow-md 
                  transform focus:scale-105 placeholder-transparent"
              />
              <label 
                htmlFor="email"
                className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:bg-white peer-focus:px-1 peer-valid:bg-white peer-valid:px-1"
              >
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                id="password"
                type="password"
                name="password"
                value={value.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="peer block w-full rounded-lg border border-gray-300 p-3 
                  focus:ring-4 focus:ring-blue-200 focus:border-blue-400 
                  transition-all duration-300 hover:border-blue-300 hover:shadow-md 
                  transform focus:scale-105 placeholder-transparent"
              />
              <label 
                htmlFor="password"
                className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:bg-white peer-focus:px-1 peer-valid:bg-white peer-valid:px-1"
              >
                Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={value.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="peer block w-full rounded-lg border border-gray-300 p-3 
                  focus:ring-4 focus:ring-blue-200 focus:border-blue-400 
                  transition-all duration-300 hover:border-blue-300 hover:shadow-md 
                  transform focus:scale-105 placeholder-transparent"
              />
              <label 
                htmlFor="confirmPassword"
                className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:bg-white peer-focus:px-1 peer-valid:bg-white peer-valid:px-1"
              >
                Confirm Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg 
                hover:from-blue-600 hover:to-blue-800 transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg active:scale-95 
                font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline transition-all duration-200 hover:text-blue-800 hover:scale-105 inline-block"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
