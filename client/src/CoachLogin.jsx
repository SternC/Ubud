import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/ui/bg';
import api from "./api";

export default function CoachApply() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  api.defaults.withCredentials = true;

  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome, future coach!";

  const [value, setValue] = useState({
    driveLink: '',
    teachingField: ''
  });
  const [loading, setLoading] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    api.get("/authentication")
      .then(res => {
        if (res.status !== 200) navigate("/login");
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  // Typing effect
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else clearInterval(timer);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/coach-apply', value);
      if (res.status === 201) {
        showToast(res.data.message, 'success');
        setTimeout(() => navigate("/profile"), 1500);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Application failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const logoClasses = `w-35 h-35 bg-white rounded-full flex items-center justify-center transition-transform duration-500 
    ${isCardHovered ? 'scale-125 translate-y-2 rotate-12' : ''}`;
  const cardClasses = `bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transform transition-all duration-300`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fff1da] via-[#8cecff] to-[#0486ba]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Background
          colors={["#60e7ce", "#b2fdfb"]}
          mouseForce={10}
          cursorSize={1000}
          isViscous={false}
          viscous={10}
          iterationsViscous={10}
          iterationsPoisson={5}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={1}
          autoIntensity={0.5}
          takeoverDuration={0.1}
          autoResumeDelay={0}
          autoRampDuration={0.6}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div
          className={cardClasses}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div className="text-center mb-6">
            <div className={`w-44 h-44 mx-auto mb-4 rounded-full flex items-center justify-center transform transition-all duration-500
              ${isCardHovered ? 'scale-110 rotate-6 translate-y-1' : ''}`}>
              <div className={logoClasses}>
                <img src="/logo.png" alt="Coach Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Hi Coach!</h1>
            <p className="text-gray-600 cursor-default min-h-[24px]">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="url"
              name="driveLink"
              value={value.driveLink}
              onChange={handleChange}
              placeholder="Google Drive Link (CV/Portfolio)"
              required
              className="block w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
            />

            <input
              type="text"
              name="teachingField"
              value={value.teachingField}
              onChange={handleChange}
              placeholder="Field you want to teach (e.g. Math, Science)"
              required
              className="block w-full rounded-lg border border-gray-300 p-3 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg 
                hover:from-blue-600 hover:to-blue-800 transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg active:scale-95 
                font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>

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
