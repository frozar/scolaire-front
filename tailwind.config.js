/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],

  theme: {
    zIndex: {
      innerModal: "1399",
      layoutTop: "1400",
      layoutLeft: "1401",
      userInformations: "1402",
      modal: "1410",
    },
    extend: {
      colors: {
        "green-light": "#8FE2BA",
        "green-base": "#0cc683",
        "red-base": "#f44434",
        "dark-teal": "#062f3f",
        "dark-shade-teal": "#062f3fcc",
        "gray-base": "#aeb8b4",
        "gray-shade-base": "#ccd6d2",
        "gray-light": "#E8EFEC",
        "yellow-base": "#F9C932",
        "orange-base": "#ea5920",
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
  plugins: ["@tailwindcss/forms"],
};
