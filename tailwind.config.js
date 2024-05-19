/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        slide: 'slide 0.2s ease-in-out',
      },
      keyframes: {
        slide: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      width: {
        18: '4.5rem',
        25: '6.25rem',
      },
    },
  },
  plugins: [],
};
