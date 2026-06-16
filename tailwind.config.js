/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          base: '#0A0A0A',
          elevated: '#141414',
          light: '#1F1F1F',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E9CD6B',
          dark: '#A8860C',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(212, 175, 55, 0.15)',
        'gold-glow-lg': '0 0 50px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
