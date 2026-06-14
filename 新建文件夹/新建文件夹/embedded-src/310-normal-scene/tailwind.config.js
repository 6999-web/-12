/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lab: {
          ink: "#06162B",
          panel: "#0A2748",
          cyan: "#4FC3FF",
        },
      },
    },
  },
  plugins: [],
};
