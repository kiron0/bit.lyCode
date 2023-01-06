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
  daisyui: {
    themes: [
      {
        url_shortener_theme: {
          primary: "#8b5cf6",
          secondary: "#a855f7",
          accent: "#FF4545",
          neutral: "#3d4451",
          success: "#22c55e",
          warning: "#facc15",
          error: "#881337",
          "base-100": "#ffffff",
          "base-200": "#FFF0F5",
          "base-300": "#f5f6fa",
        },
      },
      "night",
    ],
  },
  plugins: [require("daisyui")],
};
