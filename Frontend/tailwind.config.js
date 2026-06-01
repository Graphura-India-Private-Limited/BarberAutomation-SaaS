/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          orange: "#f97316",
          dark:   "#111827",
          cream:  "#fdfcfb",
          slate:  "#64748b",
        },
        surface:   "#ffffff",
        primary:   "#111827",
        secondary: "#374151",
        muted:     "#6b7280",
        border:    "#d1d5db",
        accent:    "#cbd5e1",
        error: {
          bg:     "#fef2f2",
          border: "#ef4444",
          text:   "#b91c1c",
        },
        success: {
          bg:     "#ecfdf5",
          border: "#10b981",
          text:   "#047857",
        },
        warning: {
          bg: "#fff7ed",
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}