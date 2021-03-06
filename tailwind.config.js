// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      emerald: colors.emerald,
      blue: colors.blue
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    maxWidth: {
      '1/2': '50%',
      '2/5': '40%'
    },
    minWidth: {
      10: '10rem'
    },
    container: {
      padding: '.5rem'
    },
    extend: {
    }
  },
  variants: {
    extend: {
      margin: ['first']
    }
  },
  plugins: []
}
