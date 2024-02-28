/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#0197f6',
        secondary: '#70b77e'
      }
    }
  }
}
