import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "day" | "night" | "pirate";

type ThemeConfig = {
  label: string;
  icon: string;
  background: string;
  headerBg: string;
  accent: string;
  accentText: string;
  textPrimary: string;
  textSecondary: string;
};

export const themes: Record<ThemeName, ThemeConfig> = {
  day: {
    label: "Cozy day",
    icon: "🌤️",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(159,216,255,0.25),_transparent_40%),linear-gradient(135deg,_#fefdf5_0%,_#fff7e0_45%,_#e9f7ff_100%)]",
    headerBg: "border-white/60 bg-white/60",
    accent: "bg-sky-500",
    accentText: "text-sky-700",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-500",
  },
  night: {
    label: "Starlight night",
    icon: "🌙",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_45%),linear-gradient(135deg,_#0f172a_0%,_#1e1b4b_45%,_#312e81_100%)]",
    headerBg: "border-indigo-400/20 bg-indigo-950/50",
    accent: "bg-indigo-500",
    accentText: "text-indigo-200",
    textPrimary: "text-indigo-50",
    textSecondary: "text-indigo-300",
  },
  pirate: {
    label: "Pirate camp",
    icon: "🏴‍☠️",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(217,163,90,0.35),_transparent_45%),linear-gradient(135deg,_#fdf3df_0%,_#f4e3bd_45%,_#e8d3a0_100%)]",
    headerBg: "border-amber-900/20 bg-amber-50/70",
    accent: "bg-amber-700",
    accentText: "text-amber-900",
    textPrimary: "text-amber-950",
    textSecondary: "text-amber-800",
  },
};

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  config: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "villageverse-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("day");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    window.localStorage.setItem(STORAGE_KEY, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside a ThemeProvider");
  return ctx;
}
