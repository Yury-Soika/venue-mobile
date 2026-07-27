/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0b0f',
        surface: '#141518',
        'surface-2': '#1c1d22',
        border: '#2a2b30',
        foreground: '#f4f4f6',
        muted: '#8b8d97',
        subtle: '#4a4c57',
        accent: '#7c6ff7',
        'accent-soft': '#5b52e0',
        success: '#4ade80',
        danger: '#f87171',
        warning: '#fbbf24',
      },
    },
  },
  plugins: [],
};
