/** @type {import('tailwindcss').Config} */
import { generateColorVariants } from './custom_tailwindcss/colors.js';
import generateFontSizeVariants from './custom_tailwindcss/fontSizes.js';

const colorDefinitions = [
  { colorName: 'primary', mainHex: '#0E50F1' },
  { colorName: 'secondary', mainHex: '#01FFD1' },
  { colorName: 'dark', mainHex: '#575757' },
  { colorName: 'light', mainHex: '#E5E5E5' },
];
const colorVariants = generateColorVariants(colorDefinitions);
const fontSizeVariants = generateFontSizeVariants(1, 1.618);
const fontFamilyVariants = {
  'heading': ['Poppins', 'Poppins', 'sans-serif'],
  'body': ['Inter', 'Inter', 'sans-serif'],
  'accent': ['Oswald', 'Oswald', 'sans-serif'],
}
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./containers/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  corePlugins: {
    // ...
    container: false,
  },
  theme: {
    container: {
      screens: {
        sm: '500px',
        md: '600px',
        lg: '700px',
        xl: '900px',
        '2xl': '1440px',
        '4xl': '1900px',
      },
    },
    extend: {
      colors: colorVariants,
      fontSize: fontSizeVariants,
      fontFamily: fontFamilyVariants,
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          padding: '0 1rem 0 1rem',
          '@screen sm': {
            maxWidth: '100%',
            padding: '0 2rem 0 2rem'
          },
          '@screen md': {
            maxWidth: '100%',
            padding: '0 3rem 0 3rem'
          },
          '@screen lg': {
            maxWidth: '75vw',
            padding: '0'
          },
          '@screen xl': {
            maxWidth: '75vw',
            padding: '0'
          },
          '@screen 2xl': {
            maxWidth: '75vw',
            padding: '0'
          },
        }
      })
    }
  ]
}