/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#0E0F11",
        surface1: "#16181B",
        surface2: "#1E2124",
        surface3: "#26292D",
        hairline: "#2B2E33",
        strong: "#383C42",
        primary: "#F2F1EE",
        secondary: "#A8A9AC",
        tertiary: "#6B6D71",
        accent: {
          DEFAULT: "#D4A24C",
          hover: "#E3B563",
          muted: "rgba(212, 162, 76, 0.12)",
        },
        priority: {
          low: "#6E9BD1",
          medium: "#D9A441",
          high: "#E2604A",
        },
        status: {
          success: "#5FB88A",
          danger: "#E2604A",
          info: "#6E9BD1",
        },
      },
      fontFamily: {
        display: ["General Sans", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["40px", { lineHeight: "48px", fontWeight: "600" }],
        h1: ["28px", { lineHeight: "36px", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500", letterSpacing: "0.04em" }],
        mono: ["13px", { lineHeight: "20px", fontWeight: "500" }],
      },
      spacing: {
        1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px",
        6: "24px", 8: "32px", 10: "40px", 16: "64px",
      },
      borderRadius: {
        sm: "6px", md: "10px", lg: "14px", pill: "999px",
      },
      transitionDuration: {
        instant: "100ms", fast: "160ms", base: "220ms", slow: "360ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4,0,0.2,1)",
        out: "cubic-bezier(0,0,0.2,1)",
        in: "cubic-bezier(0.4,0,1,1)",
      },
      boxShadow: {
        elevate: "0 4px 16px rgba(0,0,0,0.4)",
        modal: "0 12px 40px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
