// src/App.jsx
import React from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import MerchCTA from './components/MerchCTA';
import JoinCTA from './components/JoinCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="font-sans antialiased text-gray-900">
      <NavBar />
      <main className="pt-16"> {/* pt-16 to offset fixed NavBar height */}
        <HeroSection />
        <WhoWeAre />
        <MerchCTA />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
