/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",        // slate-900-ish
        muted: "rgba(255,255,255,0.7)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};
