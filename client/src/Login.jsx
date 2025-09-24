import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const [displayText, setDisplayText] = useState("");
  const fullText = "Let's get you in";

  const [value, setValue] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/authentication")
      .then((res) => {
        if (res.status === 200){
          navigate("/app");
        }
      })
  }, []);

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

    axios.post('http://localhost:5000/login', value)
      .then(res => {
        if (res.status === 200) {
          showToast("Login Successful!", "success");
          setTimeout(() => navigate("/profile"), 100);
        } else {
          showToast("Login Failed", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Login Failed", "error");
      })
      .finally(() => setLoading(false));
  };

  const logoClasses = `w-35 h-35 bg-white rounded-full flex items-center justify-center transition-transform duration-500 
    ${isCardHovered ? 'scale-125 translate-y-2 rotate-12' : ''}`;

  const cardClasses = `bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transform transition-all duration-300`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#000B58] via-[#1c6ea4] to-[#FFF9AF]">
      <div className="w-full max-w-md">
        <div 
          className={cardClasses}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div className="text-center mb-6">
            {/* Logo */}
            <div className={`w-44 h-44 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-all duration-500
              ${isCardHovered ? 'scale-110 rotate-6 translate-y-1' : ''}`}>
              <div className={logoClasses}>
                <img src="/logo.png" alt="Ubud Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2 transition-colors duration-300 hover:text-blue-600 cursor-default">
              Hi Buddy!
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
                placeholder="Username"
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
                  peer-focus:-top-5 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-5 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:px-1 peer-valid:px-1"
              >
                Username
              </label>
            </div>

            {/* Password */}
            <div className="relative group mt-6">
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
                  peer-focus:-top-5 peer-focus:left-0 peer-focus:text-xs peer-focus:text-blue-600
                  peer-valid:-top-5 peer-valid:left-0 peer-valid:text-xs peer-valid:text-gray-600
                  peer-focus:px-1 peer-valid:px-1"
              >
                Password
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline transition-all duration-200 hover:text-blue-800 hover:scale-105 inline-block"
            >
              Register here
            </Link>
          </p>
                {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl text-white font-medium text-lg
            animate-fadeIn z-50
            ${toast.type === "success" ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-400 to-red-600"}`}
        >
          {toast.message}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
