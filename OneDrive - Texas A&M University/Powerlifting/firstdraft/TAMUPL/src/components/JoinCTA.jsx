// src/components/JoinCTA.jsx
import React from 'react';

export default function JoinCTA() {
  return (
    <section id="join" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold text-[#500000]">
          Want to Lift with Us?
        </h3>
        <p className="mt-4 text-gray-700">
          We’re always looking for athletes—from newcomers to national contenders. 
          Fill out our interest form and a team representative will get back to you soon.
        </p>
        <a
          href="https://your‑interest‑form.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 px-8 py-4 bg-[#500000] text-white font-bold rounded-md hover:bg-[#3f0000] transition"
        >
          Fill Out Interest Form
        </a>
      </div>
    </section>
  );
}
