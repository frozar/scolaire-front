/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],

  /* Rebuild cypress docker when this file get update */
  theme: {
    zIndex: {
      layoutTop: "1400",
      layoutLeft: "1401",
    },
    extend: {},
  },
  purge: {
    options: {
      safelist: [
        "translate-x-[-7rem]",
        "translate-x-[-185px]",
        "translate-x-[35px]",
      ],
    },
  },
  // plugins: [require("daisyui"), "@tailwindcss/forms"],
  plugins: ["@tailwindcss/forms"],
};
