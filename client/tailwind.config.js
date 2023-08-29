/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // maybe set this to media later
  theme: {
    extend: {
      height: {
        '1/6': '16.666667%'
      },
      fontFamily: {
        "indieflower": ['"Indie Flower"', 'cursive']
      },
      colors: {
        "headergreen": "#6EAF5E",
        "bodygreen": "#91C865",
        "borderheadergreen": "#5A8F45",
        "logingreen": "#AAE39B",
        "loginbordergreen": "#51B937",
        "listbordergreen": "#2C690F",
        "buttongreen": "#87D673",
        "popupgreen": "#A8CE9F",
        "popupbordergreen": "#0E6500"
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}