/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        island: {
          50: "#f7f3ff",
          100: "#ece3ff",
          200: "#d7c1ff",
          300: "#ba8bff",
          400: "#8f4fff",
          500: "#7434e8",
          600: "#5d2dc1",
          700: "#4c249b",
          800: "#3d1f7a",
          900: "#30175f"
        }
      }
    }
  },
  plugins: [],
};
