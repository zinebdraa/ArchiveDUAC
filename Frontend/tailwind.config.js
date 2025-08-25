/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#819A91",
        "secondary-green": "#A7C1A8",
        "green-3": "#D1D8BE",
        "green-4": "#EEEFE0",
      },
      fontFamily: {
        instrument: ["Instrument Sans", "sans-serif"],
        jacques: ["Jacques Francois Shadow", "serif"],
      },
    },
  },
  plugins: [],
};
