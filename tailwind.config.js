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
        body: 'calc(100vh - 6rem)',
      },
      keyframes: {
        slide: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      maxHeight: {
        body: 'calc(100vh - 6rem)',
      },
      maxWidth: {
        364: '91rem',
      },
      translate: {
        'minus-2/4': '-50%',
      },
      width: {
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        128: '32rem',
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      '3xl': '1792px',
      // => @media (min-width: 1792px) { ... }
      '4xl': '2048px',
      // => @media (min-width: 1792px) { ... }
    },
  },
  plugins: [],
};
