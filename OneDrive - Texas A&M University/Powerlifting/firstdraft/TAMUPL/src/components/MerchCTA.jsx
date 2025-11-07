// src/components/MerchCTA.jsx
import React from 'react';

export default function MerchCTA() {
  return (
    <section id="merch" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold text-[#500000]">
          Represent the Brand: Get Your TAMU Powerlifting Gear
        </h3>
        <p className="mt-4 text-gray-700">
          Show off your Aggie spirit in style. From t‑shirts to hoodies, all proceeds help fund our competitions and training.
        </p>
        <a
          href="https://your‑merch‑url.com"
          className="inline-block mt-6 px-8 py-4 bg-[#500000] text-white font-bold rounded-md hover:bg-[#3f0000] transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
