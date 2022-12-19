/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        goodVibrationsScript: ["GOOD VIBRATIONS SCRIPT", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
};
