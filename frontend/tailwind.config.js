/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sgorange': '#FFAB7B',
        'sgorange2': '#FF5C00',
        'sgdark':'#2A2F35',
        'sgblueish':'#3A3C51',
        'sgbrown':'#DDB598',
        'sgyellow':'#FFFDC3',
        'sgbodycopy': '#59342B'
        },
      fontFamily: {
        gatwickreg: ["GATWICKREG", "sans-serif"],
        gatwickbold: ["GATWICKBOLD", "bold"],
      },
    },
    screens: {
      'xs': '480px',
      'sm':'640px',
      'md':'768px',
      'lg':'1024px',
      'xl':'1280px',
      '2xl':'1536px',
    },
  },
  plugins: [],
}