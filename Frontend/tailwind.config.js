/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          blue: '#0095f6',
          'light-blue': '#4cb5f9',
          gray: '#737373',
          'light-gray': '#dbdbdb',
          bg: '#fafafa',
          border: '#dbdbdb'
        }
      }
    },
  },
  plugins: [],
}
