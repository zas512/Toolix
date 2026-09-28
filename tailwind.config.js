/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#F8F7F5",
          dark: "#121214",
        },
        text: {
          light: "#0F1115",
          dark: "#F4F3F0",
        },
        muted: {
          light: "#7A7670",
          dark: "#7A7670",
        },
        accent: "#2563EB",
      },
      fontFamily: {
        sans: ["Geist Sans", "Inter", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        "ease-out": "ease-out",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
