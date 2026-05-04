/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Premium Button Shine Effect sathi he keyframes vapra
        shine: {
          '100%': { left: '125%' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        // 'animate-shine' class vaprun tu button la shiny banavu shaktes
        shine: 'shine 1.5s ease-out infinite',
      },
    },
  },
  plugins: [],
}