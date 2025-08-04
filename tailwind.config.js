/** @type {import('tailwindcss').Config} */
module.exports = {
//   content: [
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/sonner/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
        colors: {
        border: 'hsl(var(--border))',
        borderDark: 'hsl(var(--border-dark))',
        sidebar: 'hsl(var(--sidebar))',
        sidebarDark: 'hsl(var(--sidebar-dark))',
        sidebarForeground: 'hsl(var(--sidebar-foreground))',
        sidebarForegroundDark: 'hsl(var(--sidebar-foreground-dark))',
        sidebarAccent: 'hsl(var(--sidebar-accent))',
        sidebarAccentDark: 'hsl(var(--sidebar-accent-dark))',
        sidebarAccentForeground: 'hsl(var(--sidebar-accent-foreground))',
        sidebarAccentForegroundDark: 'hsl(var(--sidebar-accent-foreground-dark))',
      },
      },
      keyframes: {
        wave: {
          "0%": { marginLeft: "0" },
          "100%": { marginLeft: "-3190px" },
        },
        swell: {
          "0%, 100%": { transform: "translate3d(0,-25px,0)" },
          "50%": { transform: "translate3d(0,5px,0)" },
        },
      },
      animation: {
        wave: "wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        swell: "swell 7s ease -1.25s infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
