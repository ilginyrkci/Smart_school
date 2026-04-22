/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary:   '#FF6B6B',
          secondary: '#4D96FF',
          bg:        '#FFF7ED',
          accent:    '#FFD93D',
          text:      '#2D2D2D',
          textMuted: '#6B7280',
          border:    '#FFDCC8',
          card:      '#FFFFFF',
        }
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      }
    },
  },
  plugins: [],
}
