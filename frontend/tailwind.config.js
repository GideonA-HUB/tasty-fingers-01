/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Legacy token names — values are Tasty Fingers orange
          pink: '#ED7D2B',
          'pink-dark': '#C65A12',
          'pink-light': '#F5A623',
          orange: '#ED7D2B',
          'orange-dark': '#C65A12',
          'orange-light': '#F5A623',
          'orange-pale': '#FFF7ED',
          black: '#1A1208',
          accent: '#3D2A1A',
          white: '#FFFFFF',
          cream: '#FFFBF5',
          gray: {
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
          },
        },
        dark: {
          surface: '#1A1208',
          card: '#2D1F12',
          elevated: '#3D2A1A',
          border: '#5C4030',
          muted: '#D4A574',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'serif'],
      },
      borderRadius: {
        luxury: '20px',
        card: '16px',
      },
      boxShadow: {
        luxury: '0 4px 24px rgba(237, 125, 43, 0.08)',
        'luxury-lg': '0 8px 40px rgba(237, 125, 43, 0.12)',
        card: '0 2px 16px rgba(237, 125, 43, 0.06)',
        orange: '0 4px 20px rgba(237, 125, 43, 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #C65A12 0%, #ED7D2B 50%, #F5A623 100%)',
        'brand-gradient-vertical': 'linear-gradient(180deg, #C65A12 0%, #ED7D2B 45%, #F5A623 100%)',
        'brand-gradient-soft': 'linear-gradient(180deg, #FFF7ED 0%, #FFFBF5 50%, #FFFFFF 100%)',
        'hero-radial': 'radial-gradient(ellipse at center bottom, rgba(237,125,43,0.25) 0%, transparent 70%)',
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
