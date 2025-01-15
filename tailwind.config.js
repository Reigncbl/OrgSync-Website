/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/client/**/*.{html,php}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        monserrat: ['Montserrat, sans-serif'],
        roboto: ['Roboto Serif , sans-serif'],
      },
    },
  },
  plugins: [],
}