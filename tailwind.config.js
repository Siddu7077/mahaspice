/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aliceBlue: '#f8f8f8',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        bounceText: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(calc(-100% + 100vw))' }
        }
      },
      animation: {
        bounceText: 'bounceText 15s linear infinite alternate',
      }
    },
  },
  plugins: [],
};