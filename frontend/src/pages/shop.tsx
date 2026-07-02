import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionCard from "../components/SectionCard";
import { categories } from "../data/mockData";
import { useTheme, ThemeName, themes } from "../context/ThemeContext";

const API_BASE = "http://127.0.0.1:8000/api/game/shop";

// Placeholder until real auth exists — stored per-browser so purchases persist for you locally.
function getUsername() {
  if (typeof window === "undefined") return "guest";
  let name = window.localStorage.getItem("villageverse-username");
  if (!name) {
    name = "guest";
    window.localStorage.setItem("villageverse-username", name);
  }
  return name;
}

type ShopItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rarity: string;
  description: string;
  emoji: string;
  theme: ThemeName;
};

export default function ShopPage() {
  const { config } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeThemeFilter, setActiveThemeFilter] = useState<ThemeName | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const [items, setItems] = useState<ShopItem[]>([]);
  const [owned, setOwned] = useState<Record<number, number>>({});
  const [coins, setCoins] = useState<number | null>(null);
  const [selected, setSelected] = useState<ShopItem | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const username = useMemo(getUsername, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const url = activeThemeFilter === "all" ? `${API_BASE}/items` : `${API_BASE}/items?theme=${activeThemeFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items);
    } catch {
      setStatus("Could not reach the backend. Is uvicorn running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const loadOwned = async () => {
    try {
      const res = await fetch(`${API_BASE}/owned?username=${username}`);
      const data = await res.json();
      setOwned(data.owned ?? {});
      setCoins(data.coins ?? 0);
    } catch {
      // handled via loadCatalog's status message already
    }
  };

  useEffect(() => {
    loadOwned();
  }, [username]);

  useEffect(() => {
    loadCatalog();
  }, [activeThemeFilter]);

  const filteredItems = useMemo(() => {
    const base = items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    return [...base].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rarity") return a.rarity.localeCompare(b.rarity);
      return b.stock - a.stock;
    });
  }, [items, activeCategory, query, sort]);

  const handleBuy = async (item: ShopItem) => {
    if (coins !== null && coins < item.price) {
      setStatus(`Not enough coins for ${item.name} — you need ${item.price - coins} more.`);
      return;
    }
    setBuyingId(item.id);
    try {
      const res = await fetch(`${API_BASE}/buy?username=${username}&item_id=${item.id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : err.detail?.message ?? "Purchase failed.");
        return;
      }
      const data = await res.json();
      setCoins(data.remaining_coins);
      setOwned((prev) => ({ ...prev, [item.id]: data.quantity_owned }));
      setStatus(`Bought ${item.name}! You now own ${data.quantity_owned}.`);
    } catch {
      setStatus("Could not reach the backend. Is uvicorn running on port 8000?");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>VillageVerse | Shop</title>
        <meta name="description" content="Browse a warm and premium marketplace for island treasures." />
      </Head>

      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${config.accentText}`}>Island marketplace</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-800">Curated finds for every cozy corner.</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                💰 {coins === null ? "…" : coins.toLocaleString()} coins
              </div>
              <div className="flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                <span className="mr-2 text-sm">🔎</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search items"
                  className="w-44 bg-transparent text-sm outline-none sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveThemeFilter("all");
                setActiveCategory("All");
                setQuery("");
              }}
              className={`rounded-full px-3 py-2 text-sm ${
                activeThemeFilter === "all" && activeCategory === "All"
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Browse all
            </button>
            {(Object.keys(themes) as ThemeName[]).map((name) => (
              <button
                key={name}
                onClick={() => setActiveThemeFilter(name)}
                className={`rounded-full px-3 py-2 text-sm ${
                  activeThemeFilter === name ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-600"
                }`}
              >
                {themes[name].icon} {themes[name].label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3 py-2 text-sm ${
                  activeCategory === category ? "bg-sky-500 text-white shadow-md" : "bg-slate-100 text-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {loading ? "Loading…" : `Showing ${filteredItems.length} curated items`}
            </p>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>

          {status && <p className="mt-3 text-sm font-medium text-amber-700">{status}</p>}
        </motion.section>

        {!loading && items.length > 0 && (
          <SectionCard title="Popular in VillageVerse" subtitle="Trending picks other islanders are collecting">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {[...items]
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 6)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="flex min-w-[132px] flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center transition hover:border-slate-300"
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-medium text-slate-700 line-clamp-1">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.price} coins</span>
                  </button>
                ))}
            </div>
          </SectionCard>
        )}

        <SectionCard title="Marketplace" subtitle="Browse, preview, and collect with ease">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const qtyOwned = owned[item.id] ?? 0;
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer rounded-[1.35rem] border border-slate-100 bg-slate-50 p-4 shadow-sm transition hover:border-slate-300"
                  onClick={() => setSelected(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{item.emoji}</div>
                    {qtyOwned > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Owned x{qtyOwned}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {item.rarity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                    <span>{item.category}</span>
                    <span>{item.stock} in stock</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-800">{item.price} coins</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleBuy(item);
                      }}
                      disabled={buyingId === item.id}
                      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {buyingId === item.id ? "Buying…" : "Buy"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="text-6xl">{selected.emoji}</div>
                <button onClick={() => setSelected(null)} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  Close
                </button>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">{selected.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{selected.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{selected.category}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{selected.rarity}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {themes[selected.theme].icon} {themes[selected.theme].label}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xl font-semibold text-slate-800">{selected.price} coins</p>
                <button
                  onClick={() => handleBuy(selected)}
                  disabled={buyingId === selected.id}
                  className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {buyingId === selected.id ? "Buying…" : "Buy now"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
