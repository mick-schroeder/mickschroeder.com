import type { Config } from "tailwindcss";

export default {
  darkMode: "media",
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;