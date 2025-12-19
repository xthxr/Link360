import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "deep-black": "#000102",
        "brand-purple": "#8B5CF6",
        "brand-blue": "#3B82F6",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-purple": "radial-gradient(circle at top left, rgba(139, 92, 246, 0.15), transparent 50%)",
        "gradient-blue": "radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.15), transparent 50%)",
      },
      backdropBlur: {
        glass: "12px",
      },
      letterSpacing: {
        tighter: "-0.05em",
      },
    },
  },
  plugins: [],
} satisfies Config;
