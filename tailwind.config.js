/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GolfGives Design Tokens
        bg: '#0A0A0F',
        surface: '#13131A',
        border: '#1E1E2E',
        'accent-green': '#00FF87',
        'accent-purple': '#7B2FBE',
        'text-primary': '#FFFFFF',
        'text-muted': '#8B8B9E',
        error: '#FF4D4D',
        success: '#00FF87',
        warning: '#FFB547',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #00FF87 0%, #00C866 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7B2FBE 0%, #5A1F8E 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0F 0%, #13131A 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 135, 0.3)',
        'glow-purple': '0 0 20px rgba(123, 47, 190, 0.3)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 135, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 255, 135, 0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
