import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nexa: {
          purple: "#9334FF",
          "purple-hover": "#7C24E0",
          "purple-deep": "#5C1AB0",
          "purple-tint": "#F4EEFF",
          "purple-soft": "#E6D5FF",
          "night-purple": "#3A2E9B",
          "dark-purple": "#0F0E13",
          "techno-purple": "#C1AAFF",
          "luminous-purple": "#AC77FF",
        },
        bg: "#FAFAF7",
        panel: "#FFFFFF",
        "panel-2": "#F4F2EE",
        text: {
          1: "#0F0F14",
          2: "#4F4D58",
          3: "#7C7986",
          4: "#A8A4B1",
        },
        border: {
          DEFAULT: "#ECEAF1",
          2: "#E4E1EA",
          3: "#D6D3DC",
        },
        side: {
          bg: "#0F0E13",
          text: "rgba(255,255,255,0.62)",
          "text-hover": "rgba(255,255,255,0.92)",
          "text-active": "#FFFFFF",
          "active-bg": "rgba(147,52,255,0.14)",
          divider: "rgba(255,255,255,0.06)",
        },
        section: {
          sop: "#0AAA85",
          login: "#E05A3B",
          team: "#C04868",
          doc: "#5066D0",
          comms: "#5066D0",
          tool: "#5A7888",
          onboarding: "#0AAA85",
        },
        status: {
          green: "#1B9A60",
          "green-bg": "#E4F5EC",
          amber: "#B07208",
          "amber-bg": "#FBF1DC",
          rose: "#C8385A",
          "rose-bg": "#FAE3E9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      spacing: {
        sidebar: "232px",
        topbar: "60px",
      },
    },
  },
  plugins: [],
};

export default config;
