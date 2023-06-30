/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
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
  plugins: [require("daisyui"), "@tailwindcss/forms"],
};
