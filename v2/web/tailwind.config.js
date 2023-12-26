/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    colors: {
      'pavlova': {
        '50': '#faf7f2',
        '100': '#f3eee1',
        '200': '#e7dbc1',
        '300': '#dccaa6',
        '400': '#c6a471',
        '500': '#ba8e55',
        '600': '#ad7b49',
        '700': '#90633e',
        '800': '#745038',
        '900': '#5f422f',
        '950': '#322118',
      },
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue: colors.blue
    }
  },
  plugins: [],
}

