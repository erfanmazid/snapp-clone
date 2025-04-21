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
        primary: "#21aa58",
        lightBlue: "#f2f5f8",
      },
      fontFamily: {
        iranSans: "var(--font-iran-sans)",
      },
    },
  },
  plugins: [],
};
export default config;
