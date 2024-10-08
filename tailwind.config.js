/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Arial', 'Helvetica', 'sans-serif'],
      },
      animation: {
        bounce: 'bounce 1s infinite',
        pulse: 'pulse var(--duration, 2s) cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        pulse: {
          '0%, 100%': { 
            opacity: 1,
            boxShadow: '0 0 0 0 var(--pulse-color, rgba(147, 51, 234, 0.5))'
          },
          '50%': { 
            opacity: .5,
            boxShadow: '0 0 0 8px var(--pulse-color, rgba(147, 51, 234, 0.5))'
          },
        },
      },
    },
  },
  plugins: [],
};