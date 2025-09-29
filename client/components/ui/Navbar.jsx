import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    const NAVBAR_HEIGHT = 70;

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;
      window.scrollTo({
        top: targetId === 'hero' ? 0 : offsetPosition, 
        behavior: 'smooth'
      });
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { id: 'hero', label: 'Homepage' },
    { id: 'features', label: 'Features' },
    { id: 'info', label: 'About Us' },
    { id: 'contact', label: 'Our Contact' },
  ];

  return (
    <nav
      className="fixed top-2 left-0 right-0 z-50 p-4 mx-35 backdrop-blur-md bg-white/20 shadow-xl transition-all duration-300 rounded-2xl"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl ">
        
        {/* Kontainer untuk Logo dan Hamburger */}
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
            onClick={(e) => handleSmoothScroll(e, 'hero')} 
          >
            <img 
              src="/logo.png" 
              alt="Ubud Logo" 
              className="h-10 w-15 transition-all duration-300 ease-out transform hover:rotate-9 hover:brightness-120 object-contain"
            />
          </div>

          {/* Ikon Hamburger (Hanya Tampil di Layar Kecil) */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9bdfebff] z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-[#004179]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6 text-[#004179]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>

        {/* Menu Utama (Sembunyi di Layar Kecil, Tampil di Layar Besar) */}
        <div className="hidden md:flex space-x-10 "> 
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className="text-[#004179] text-lg transition-all duration-300 hover:text-[#3d91e4] cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#9bdfebff] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Menu Mobile (Hanya Tampil di Layar Kecil Ketika isMenuOpen TRUE) */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 p-4 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 ease-in-out transform rounded-xl border border-gray-200${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className="text-[#004179] text-lg p-3 block hover:bg-[#e0f7ff] rounded-lg transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;