/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563EB',
        'primary-green': '#10B981',
        'accent-yellow': '#FBBF24',
        'light-gray': '#F9FAFB',
        'medium-gray': '#E5E7EB',
      },
      backgroundImage: {
        'gradient-soft-blue': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'gradient-blue-green': 'linear-gradient(120deg, #2563EB 0%, #10B981 100%)',
        'gradient-light': 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'colored': '0 4px 20px rgba(37, 99, 235, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 77, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(108, 77, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
