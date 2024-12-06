/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This includes all JSX and TSX files
  ],
  theme: {
    extend: {colors: {
      aliceBlue: '#F5F9FD', // Custom color
    },
  },
  },
  plugins: [],
};
