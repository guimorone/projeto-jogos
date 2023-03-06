/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', './index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { sky: colors.sky, teal: colors.teal, rose: colors.rose },
      backgroundImage: { 'keyboard-bg': "url('/bg.gif')" },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('flowbite/plugin')],
};
