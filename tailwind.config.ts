import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        surface: "#181818",
        text: {
          DEFAULT: "#E5E5E5",
          muted: "#9CA3AF"
        },
        accent: {
          start: "#A8E063",
          end: "#56AB2F"
        }
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(45deg,#A8E063,#56AB2F)",
        "hero-radial": "radial-gradient(circle at 20% 20%,rgba(168,224,99,0.2),transparent 55%), radial-gradient(circle at 80% 30%,rgba(86,171,47,0.16),transparent 60%)"
      },
      boxShadow: {
        glow: "0 0 32px rgba(168, 224, 99, 0.35)",
        card: "0 10px 30px rgba(0, 0, 0, 0.35)"
      },
      maxWidth: {
        content: "1200px"
      }
    }
  },
  plugins: []
};

export default config;
