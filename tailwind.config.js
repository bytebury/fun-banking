/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "16px",
      },
      screens: {
        xl: "1280px",
        "2xl": "1280px",
      },
      colors: {
        primary: "#b7f7c8",
        "primary-dark": "#84d198",
        "primary-darker": "#63b87a",
        "primary-link": "#338248",
      },
    },
  },
  plugins: [],
};
