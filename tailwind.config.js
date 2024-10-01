/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        slide: 'slide 0.2s ease-in-out',
      },
      height: {
        112: '28rem',
      },
      keyframes: {
        slide: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      maxWidth: {
        364: '91rem',
      },
      width: {
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        128: '32rem',
      },
    },
  },
  plugins: [],
};
