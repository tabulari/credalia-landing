import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: { DEFAULT: "1120px" },
    },
    extend: {
      colors: {
        // ShadCN semantic tokens → brand colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Brand tokens
        navy: { DEFAULT: "#0d2a5e", deep: "#0a2150", ink: "#11213f" },
        orange: { DEFAULT: "#f5601b", ink: "#c2440a" },
        green: { DEFAULT: "#1e9e55", ink: "#15793f", soft: "#e8f2dd", "soft-ink": "#137038", tint: "#e7faf4", bright: "#2bbd6a" },
        ink: "#14213d",
        "muted-2": "#677085",
        "bg-soft": "#f7f9fa",
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
        display: [
          "var(--font-display)",
          "DM Serif Display",
          "Georgia",
          "serif",
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
