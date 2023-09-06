import type { Config } from "tailwindcss";
import themes from "./config/themes";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  daisyui: {
    themes: themes,
    darkTheme: "business",
  },
  plugins: [require("daisyui")],
} satisfies Config;
