import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radiant-gradient(var(--tw-gradient-stops))"
      }
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
