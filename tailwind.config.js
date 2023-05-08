/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#2269DA",
        "brand-yellow": "#FDCF25",
        "brand-pink": "#EA98A6",
        "brand-grey": "#D9D9D9",
        "brand-light-grey": "#E0DFF6",
        "brand-orange": "#F2502A",
        'clear': "#FF000000",
        "brand-red": "#DF2F06",
      },
    },
  },
  plugins: [],
};
