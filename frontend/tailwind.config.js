/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface0: "#07080a",
        canvas: "#0b0d11",
        surface1: "#111419",
        surface2: "#181c23",
        surface3: "#20252f",
        surfaceElevated: "#252b37",
        hairline: "rgba(255, 255, 255, 0.08)",
        hairlineBright: "rgba(255, 255, 255, 0.15)",
        strong: "#323947",
        primary: "#f8fafc",
        secondary: "#94a3b8",
        tertiary: "#64748b",
        accent: {
          DEFAULT: "#38bdf8",
          hover: "#60a5fa",
          gradientFrom: "#38bdf8",
          gradientTo: "#6366f1",
          muted: "rgba(56, 189, 248, 0.12)",
          ring: "rgba(56, 189, 248, 0.35)",
        },
        priority: {
          low: "#38bdf8",
          medium: "#fbbf24",
          high: "#f87171",
        },
        status: {
          success: "#34d399",
          danger: "#f87171",
          info: "#38bdf8",
          warning: "#fbbf24",
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
        elevate: "0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(255, 255, 255, 0.05) inset",
        modal: "0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        glow: "0 0 20px -2px rgba(56, 189, 248, 0.3)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "card-hover": "0 12px 24px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(56, 189, 248, 0.25)",
      },
    },
  },
  plugins: [],
};
