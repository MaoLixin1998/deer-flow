import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        muted: "#727272",
        line: "#dedede",
        canvas: "#f7f7f5",
        panel: "#ffffff"
      },
      boxShadow: {
        drawer: "0 18px 60px rgba(0, 0, 0, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
