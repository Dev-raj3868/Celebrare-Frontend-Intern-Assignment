/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        gallery: {
          50: '#f7f2fc',
          100: '#eee3f8',
          200: '#dcc7ef',
          500: '#8b5db7',
          600: '#75449f',
          700: '#623785',
        },
      },
      boxShadow: {
        card: '0 8px 28px rgba(35, 20, 48, 0.07)',
      },
    },
  },
  plugins: [],
};
