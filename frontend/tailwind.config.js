/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Legacy token name kept for compatibility; values are brand black/white
          pink: '#000000',
          'pink-dark': '#0a0a0a',
          'pink-light': '#333333',
          black: '#000000',
          accent: '#1A1A1A',
          white: '#FFFFFF',
          gray: {
            50: '#F8F8F8',
            100: '#F3F3F3',
            200: '#E5E5E5',
          },
        },
        dark: {
          surface: '#0a0a0a',
          card: '#161616',
          elevated: '#1f1f1f',
          border: '#2a2a2a',
          muted: '#a3a3a3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        luxury: '20px',
        card: '16px',
      },
      boxShadow: {
        luxury: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'luxury-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        card: '0 2px 16px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'scroll-horizontal': 'scroll-horizontal var(--scroll-duration, 40s) linear infinite',
        'scroll-horizontal-reverse':
          'scroll-horizontal-reverse var(--scroll-duration, 40s) linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-horizontal': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-horizontal-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
