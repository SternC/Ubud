

import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
      setIsSidebarOpen(false); // Tutup sidebar setelah link diklik
    }
  };

  return (
    <>
      {/* Tombol Hamburger di pojok kanan atas */}
      <div
        className={`fixed z-50 top-4 right-4 p-4 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isSidebarOpen ? 'bg-white/20' : 'bg-white/20 shadow-xl'
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-6 h-6 text-white" />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-25 right-3 z-50 h-1/2 w-64 p-10 backdrop-blur-md bg-white/20 transition-transform duration-500 ease-in-out rounded-3xl ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-100'
        }`}
      >
        {/* Konten Sidebar */}
        <div className="flex flex-col space-y-7">
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, 'home')}
            className="w-full text-white text-xl font-['Raleway'] text-center transition-all duration-300 hover:text-[#9bdfebff] cursor-pointer block p-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:scale-105"
          >
            Homepage
          </a>
          <a
            href="#info"
            onClick={(e) => handleSmoothScroll(e, 'info')}
            className="w-full text-white text-xl font-['Raleway'] text-center transition-all duration-300 hover:text-[#9bdfebff] cursor-pointer block p-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:scale-105"
          >
            About Us
          </a>
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, 'features')}
            className="w-full text-white text-xl font-['Raleway'] text-center transition-all duration-300 hover:text-[#9bdfebff] cursor-pointer block p-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:scale-105"
          >
            Features
          </a>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, 'contact')}
            className="w-full text-white text-xl font-['Raleway'] text-center transition-all duration-300 hover:text-[#9bdfebff] cursor-pointer block p-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:scale-105"
          >
            Our Contact
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;