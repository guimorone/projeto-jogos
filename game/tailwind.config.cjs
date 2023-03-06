/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { sky: colors.sky, teal: colors.teal, rose: colors.rose } } },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('flowbite/plugin')],
};
