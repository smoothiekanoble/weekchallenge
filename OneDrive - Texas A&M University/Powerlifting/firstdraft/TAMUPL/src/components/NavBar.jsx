// src/components/NavBar.jsx
import React from 'react';

export default function NavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 bg-white bg-opacity-80 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="text-2xl font-semibold text-[#500000]">TAMU Powerlifting</div>

        {/* Links */}
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <a href="#about" className="hover:text-[#500000]">
              About
            </a>
          </li>
          <li>
            <a href="#portal" className="hover:text-[#500000]">
              Athlete Portal
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-[#500000]">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
