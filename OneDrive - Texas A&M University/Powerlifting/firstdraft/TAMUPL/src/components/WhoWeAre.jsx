// src/components/WhoWeAre.jsx
import React from 'react';

export default function WhoWeAre() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div>
          <img
            src="/images/team-photo.jpg"
            alt="TAMU Powerlifting Team"
            className="rounded-lg shadow-lg object-cover w-full h-80"
          />
        </div>

        {/* Text block */}
        <div>
          <h2 className="text-3xl font-bold text-[#500000]">Who We Are</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            The Texas A&M Powerlifting Team is a group of dedicated athletes pushing the limits of strength, technique, and teamwork. Founded to foster collegiate powerlifting excellence, we compete in regional and national meets, train together year-round, and support one another’s growth—both on and off the platform.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>• Consistently ranked in the top 10 regionally</li>
            <li>• Collegiate Nationals qualifiers and podium finishers</li>
            <li>• Open to all experience levels—from beginners to national contenders</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
