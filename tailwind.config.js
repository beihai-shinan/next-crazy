/** @type {import('tailwindcss').Config} */

const colors = require("./enki-color");

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [
    // require("@tailwindcss/line-clamp"),
    // require("tailwindcss-safe-area"),
    // require("tailwindcss-textshadow"),
  ],
}
