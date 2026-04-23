/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#FF671F',
        green: '#046A38',
        navy: '#1a1a2e',
        'light-saffron': '#FFF3E6',
        'light-green': '#E6F4EA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
