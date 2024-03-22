import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        padding: "12px",
        center: true,
      },
      colors: {
        primary: "#1d692f",
        "primary-hover": "#135322",
        tonal: "#def5d9",
        tertiary: "#f5d9ec",
        "tertiary-pressed": "#dfadcf",
        "error-shadow": "#f7dedc",
        outline: "#00000022",
        "input-outline": "#00000075",
        neutral: "#f6f8f1",
        "neutral-hover": "#e9ece0",
        "neutral-pressed": "#dde2d2",
        error: "#c7463c",
      },
    },
  },
  plugins: [],
};
export default config;
