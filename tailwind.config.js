/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        weather: {
          'stormy-start': '#1e293b',
          'stormy-end': '#1e3a8a',
          'cloudy-start': '#9ca3af',
          'cloudy-end': '#4b5563',
          'clear-start': '#7dd3fc',
          'clear-end': '#0ea5e9',
          'sunny-start': '#fde68a',
          'sunny-end': '#7dd3fc',
        },
        accent: {
          mint: '#86efac',
          amber: '#fbbf24',
          lavender: '#c4b5fd',
        }
      },
      animation: {
        'rain': 'rain 0.5s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 0.3s ease-in-out',
      },
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

