import React from 'react';

const Navbar = () => {

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
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div 
          className="flex items-center space-x-3 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
          onClick={(e) => handleSmoothScroll(e, 'hero')} 
        >
          <img 
            src="/logo.png" 
            alt="Ubud Logo" 
            className="h-10 w-15 transition-all duration-300 ease-out transform hover:rotate-9 hover:brightness-120"
          />
          
        </div>
        <div className="flex space-x-10 ">
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
    </nav>
  );
};

export default Navbar;