/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  purge: {
    options: {
      safelist: ["translate-x-[-7rem]"],
    },
  },
  plugins: [require("daisyui"), "@tailwindcss/forms"],
};
