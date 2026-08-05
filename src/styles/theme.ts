export const theme = {
  colors: {
    bgPrimary: "#0B0B0D",
    bgSecondary: "#141416",
    card: "#1B1B1F",
    elevated: "#222227",
    border: "#2A2A30",
    textPrimary: "#F5F1EA",
    textSecondary: "#B8B2A8",
    textMuted: "#7E7A73",
    accent: "#C8A96A",
    accentSoft: "#D8CBB8",
    whatsapp: "#25D366",
    success: "#3CCF7A",
    warning: "#E0B04B",
    error: "#E05252",
    info: "#5A8DEE",
  },
  radius: {
    sm: 12,
    md: 14,
    lg: 18,
    xl: 20,
  },
  spacing: {
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
    section: 56,
  },
  shadows: {
    soft: "0 16px 40px rgba(0, 0, 0, 0.28)",
    whatsapp: "0 12px 30px rgba(37, 211, 102, 0.22)",
  },
  breakpoints: {
    tablet: 1024,
    mobile: 768,
  },
} as const;

export type AppTheme = typeof theme;
