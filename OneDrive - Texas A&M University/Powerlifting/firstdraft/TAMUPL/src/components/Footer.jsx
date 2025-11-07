// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#500000] text-white py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Team info */}
        <div className="text-center md:text-left">
          <p className="font-semibold">Texas A&M Powerlifting</p>
          <p className="text-sm mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>

        {/* Right: Social or sponsor logos */}
        <div className="mt-4 md:mt-0 flex space-x-4">
          {/* Example Sponsor Logos */}
          <img src="/images/sbd-logo-white.png" alt="SBD" className="h-8" />
          <img src="/images/eleiko-logo-white.png" alt="Eleiko" className="h-8" />
          <img src="/images/110percent-logo-white.png" alt="110%" className="h-8" />
        </div>
      </div>
    </footer>
  );
}
