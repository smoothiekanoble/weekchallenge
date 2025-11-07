// src/components/HeroSection.jsx
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-loop.mp4"  /* <-- Place your optimized MP4 in public/videos/hero-loop.mp4 */
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content over video */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          Texas A&M Powerlifting
        </h1>
        <p className="mt-4 text-gray-200 text-lg md:text-2xl max-w-2xl">
          Building strength, community, and champions in the heart of Aggieland.
        </p>
        <div className="mt-8 flex space-x-4">
          <a
            href="#merch"
            className="px-6 py-3 bg-[#500000] text-white font-semibold rounded-md hover:bg-[#3f0000] transition"
          >
            Shop Merch
          </a>
          <a
            href="#join"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-[#500000] transition"
          >
            Join the Team
          </a>
        </div>
      </div>
    </section>
  );
}
