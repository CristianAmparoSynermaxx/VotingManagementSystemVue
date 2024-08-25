module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        "primary": "#ea580c",
        "primary-hover": "#c2410c",
        "secondary-100": "#03827E",
        "secondary-200": "#047D8D",
        "secondary-300": "#036B7D",
        "backdrop": "rgba(128, 128, 128, .25)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      gridTemplateColumns: {
        "70/30": "70% 28%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
