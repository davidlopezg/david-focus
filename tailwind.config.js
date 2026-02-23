export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#0d59f2",
        primaryHover: "#0b4bc7",
        secondary: "#8b5cf6",
        background: {
          light: "#f5f6f8",
          dark: "#101622",
        },
        block: {
          green: "#10b981",
          blue: "#0d59f2",
          yellow: "#fbbf24",
          white: "#ffffff",
          slate: "#f1f5f9",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
