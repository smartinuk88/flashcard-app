/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  safelist: ["bg-one", "bg-two", "bg-three"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      one: "#00B6EC",
      two: "#D81E5B",
      three: "#F0544F",
      white: "#fff",
      dark: "#3A3335",
      light: "#FDF0D5",
      green: colors.green,
      red: colors.red,
    },
    extend: {},
  },
  plugins: [],
};
