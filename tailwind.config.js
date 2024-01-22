/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "primary-blue": "#13b6c9",
      "secondary-blue": "#54dee9",
      white: "#fbfffa",
      green: colors.green,
      red: colors.red,
    },
    extend: {},
  },
  plugins: [],
};
