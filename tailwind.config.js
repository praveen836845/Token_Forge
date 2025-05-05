/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ... your existing color config ...
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s linear infinite',
        'gradient-shine': 'gradient-shine 3s linear infinite', // Added this line
      },
      keyframes: {
        'gradient-shine': { // Added this keyframes block
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        },
      },
      backgroundSize: { // Added this to support the animation
        '200%': '200% 100%',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};