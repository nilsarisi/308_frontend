/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        'luckiest-guy': ['"Luckiest Guy"', 'serif'],
        'karla': ['karla', 'sans-serif']
      },
      width: {
        'custom': '500px',
      },
      height: {
        'custom': '500px',
      }
    },
  },
  plugins: [],

}