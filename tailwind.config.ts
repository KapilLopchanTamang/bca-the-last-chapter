import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090e",
        surface: "#0e1320",
        "surface-elevated": "#141b2d",
        charcoal: {
          900: "#090c13",
          800: "#101623",
          700: "#182132",
        },
        gold: {
          100: "#fdf6e7",
          200: "#fae8be",
          300: "#f5d48d",
          400: "#e9b956",
          500: "#d99e2b",
          600: "#b87c1d",
          700: "#8f5a16",
        },
        amber: {
          warm: "#dfa857",
          glow: "#ffc266",
          deep: "#874e1d",
        },
        cream: {
          DEFAULT: "#fbf8f1",
          dim: "#d8d0c2",
          muted: "#9e978b",
        },
        wood: {
          dark: "#2a1b11",
          medium: "#4a301f",
          light: "#724c30",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      backgroundImage: {
        "vignette-radial": "radial-gradient(circle at center, transparent 40%, rgba(5,7,12,0.85) 100%)",
        "golden-radial": "radial-gradient(ellipse at center, rgba(233,185,86,0.15) 0%, transparent 70%)",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
