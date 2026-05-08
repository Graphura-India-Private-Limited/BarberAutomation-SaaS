// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#ffffff",
        primary: "#111827",
        secondary: "#374151",
        muted: "#6b7280",

        border: "#d1d5db",
        accent: "#cbd5e1",

        "input-bg": "#f9fafb",

        "err-bg": "#fef2f2",
        "err-bdr": "#ef4444",
        "err-txt": "#b91c1c",

        "ok-bg": "#ecfdf5",
        "ok-bdr": "#10b981",
        "ok-txt": "#047857",

        "warn-bg": "#fff7ed",
      },
    },
  },
  plugins: [],
}