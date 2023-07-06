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
    // colors: {
    //   "green-base": "#0cc683",
    //   "red-base": "#f44434",
    //   "dark-teal": "#062f3f",
    //   "dark-shade-teal": "#062f3fcc",
    //   "gray-base": "#aeb8b4",
    //   "gray-shade-base": "#ccd6d2",
    // },
    extend: {
      colors: {
        "green-base": "#0cc683",
        "red-base": "#f44434",
        "dark-teal": "#062f3f",
        "dark-shade-teal": "#062f3fcc",
        "gray-base": "#aeb8b4",
        "gray-shade-base": "#ccd6d2",
      },
    },
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
