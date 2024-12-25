/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This includes all JSX and TSX files
  ],
  theme: {
    extend: {colors: {
      aliceBlue: '#f8f8f8', // Custom color
    },
  },
  },
  plugins: [],
};
