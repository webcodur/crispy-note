import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5F1E8',
        secondary: '#2C2416',
        accent: '#FF6B6B',
        paper: {
          DEFAULT: '#FEFEFE',
          cream: '#F5F1E8',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'crumple': 'crumple 0.8s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        crumple: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(0.8) rotate(5deg)', opacity: '0.7' },
          '100%': { transform: 'scale(0.2) rotate(45deg)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'paper': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'paper-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'memo-card': '2px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config

