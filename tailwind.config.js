/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0B1C2D',
        'electric-violet': '#6C4DFF',
        'black-intense': '#000000',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0B1C2D 0%, #6C4DFF 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(108, 77, 255, 0.15), transparent 70%)',
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(108, 77, 255, 0.3)',
        'neon': '0 0 20px rgba(108, 77, 255, 0.5)',
        'neon-lg': '0 0 30px rgba(108, 77, 255, 0.6)',
        'glow': '0 4px 20px rgba(108, 77, 255, 0.25)',
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
