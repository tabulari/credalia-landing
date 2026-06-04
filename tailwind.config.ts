import type { Config } from "tailwindcss";

/**
 * Theme tokens are transcribed verbatim from the design handoff README
 * ("Design Tokens" section). Greens are intentionally split into a non-text
 * fill (`green`) and an AA-compliant text variant (`green-ink`). `muted-2`
 * was darkened from #8693a6 to #677085 to pass AA — do not revert.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Container: max-width 1120px, padding 0 24px (README "Spacing / shape").
    container: {
      center: true,
      padding: "24px",
      screens: { DEFAULT: "1120px" },
    },
    extend: {
      colors: {
        navy: "#0d2a5e",
        "navy-deep": "#0a2150",
        "navy-ink": "#11213f",
        orange: "#f5601b",
        green: "#1e9e55",
        "green-ink": "#15793f",
        "green-soft": "#e8f2dd",
        "green-soft-ink": "#137038", // active chip text on green-soft
        "green-tint": "#e7faf4",
        ink: "#14213d",
        muted: "#5d6b82",
        "muted-2": "#677085",
        bg: "#ffffff",
        "bg-soft": "#f7f9fa",
        border: "#e5e9ee",
        "border-2": "#eef1f4",
        error: "#d4483b",
        "hint-ink": "#9a4a16",
        "hint-bg": "#fff4ed",
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "22px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,32,64,.05), 0 1px 3px rgba(16,32,64,.06)",
        md: "0 6px 24px rgba(13,42,94,.07), 0 2px 6px rgba(13,42,94,.05)",
        lg: "0 24px 60px rgba(13,42,94,.14), 0 8px 24px rgba(13,42,94,.08)",
      },
      maxWidth: {
        container: "1120px",
      },
      // README breakpoints (max-width semantics handled in CSS where needed).
      screens: {
        sm: "600px",
        md: "720px",
        lg: "760px",
        timeline: "880px",
        stack: "980px",
      },
    },
  },
  plugins: [],
};

export default config;
