import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { useTheme, themes, ThemeName } from "../context/ThemeContext";

type LayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Inventory", href: "/inventory" },
  { label: "Quests", href: "/quests" },
  { label: "Admin", href: "/admin" },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, config } = useTheme();

  useSwipeNavigation();

  const isActive = useMemo(
    () => (href: string) => router.pathname === href,
    [router.pathname]
  );

  const handlePickTheme = (name: ThemeName) => {
    setTheme(name);
    setThemeMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${config.background} ${config.textPrimary} transition-colors duration-500`}>
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${config.headerBg}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-lg shadow-lg shadow-emerald-200">
              🏝️
            </div>
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>VillageVerse</p>
              <p className={`text-xs ${config.textSecondary}`}>Cozy island life</p>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <div className="flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
              <span className="mr-2 text-sm">🔎</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search island treasures"
                className="w-56 bg-transparent text-sm text-slate-800 outline-none"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? `${config.accent} text-white shadow-lg`
                    : `${config.textSecondary} hover:bg-white/20`
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setThemeMenuOpen((open) => !open)}
                className="rounded-full border border-white/70 bg-white/70 p-2 text-lg shadow-sm"
                aria-label="Change theme"
                aria-expanded={themeMenuOpen}
              >
                {config.icon}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/70 bg-white/95 py-1 text-sm shadow-xl backdrop-blur-xl">
                  {(Object.keys(themes) as ThemeName[]).map((name) => (
                    <button
                      key={name}
                      onClick={() => handlePickTheme(name)}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-slate-100 ${
                        theme === name ? "font-semibold" : ""
                      }`}
                    >
                      <span>{themes[name].icon}</span>
                      <span>{themes[name].label}</span>
                      {theme === name && <span className="ml-auto text-xs text-slate-400">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-white/80 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-4xl justify-around px-3 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center rounded-full px-3 py-2 text-xs font-semibold ${
                isActive(item.href) ? `${config.accent} text-white` : "text-slate-600"
              }`}
            >
              <span className="text-base">
                {item.label === "Home"
                  ? "🏡"
                  : item.label === "Shop"
                  ? "🛍️"
                  : item.label === "Inventory"
                  ? "🎒"
                  : "✨"}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <footer className="rounded-[2rem] border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-800">VillageVerse</p>
              <p>Carefully crafted for cozy island living, crafted with heart.</p>
            </div>
            <div className="flex gap-3 text-slate-500">
              <span>🌦️ Weather aware</span>
              <span>🌸 Seasonal charm</span>
              <span>✨ Always fresh</span>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
