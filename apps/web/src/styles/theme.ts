export const theme = {
  colors: {
    bg: "#0b0f14",
    surface: "#121922",
    surfaceHover: "#1a2330",
    border: "#243044",
    text: "#e8eef5",
    muted: "#8b9bb0",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    danger: "#ef4444",
    success: "#22c55e",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
  },
  fonts: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
} as const;

export type AppTheme = typeof theme;
