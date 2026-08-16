import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionCard from "../components/SectionCard";

const API_ROOT = process.env.NEXT_PUBLIC_API_BASE || "";
const CAMP_BASE = `${API_ROOT}/api/game/camp`;
const CRAFT_BASE = `${API_ROOT}/api/game/craft`;
const COMPANION_BASE = `${API_ROOT}/api/game/companion`;
const WEATHER_BASE = `${API_ROOT}/api/game/weather`;

function getUsername() {
  if (typeof window === "undefined") return "guest";
  let name = window.localStorage.getItem("villageverse-username");
  if (!name) {
    name = "guest";
    window.localStorage.setItem("villageverse-username", name);
  }
  return name;
}

type GatherNode = { label: string; ready: boolean; seconds_left: number };
type CampStatus = {
  camp_level: number;
  resources: { wood: number; stone: number; cloth: number };
  gather_nodes: Record<string, GatherNode>;
  next_upgrade: { level: number; cost: Record<string, number> } | null;
  weather: { name: string; emoji: string; boosted_resource: string | null; multiplier: number; flavor: string };
};
type Recipe = {
  result_item_id: number; name: string; emoji: string; description: string;
  cost: Record<string, number>; can_afford: boolean;
};
type Companion = {
  id: number; name: string; emoji: string; price: number;
  bonus_type: string; bonus_percent: number; description: string;
};

const RESOURCE_EMOJI: Record<string, string> = { wood: "🪵", stone: "🪨", cloth: "🧵" };

export default function CampPage() {
  const username = useMemo(getUsername, []);
  const [camp, setCamp] = useState<CampStatus | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [equippedId, setEquippedId] = useState<number | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const loadCamp = async () => {
    try {
      const res = await fetch(`${CAMP_BASE}/status?username=${username}`);
      setCamp(await res.json());
    } catch {
      setStatus("Could not reach the backend.");
    }
  };

  const loadCraft = async () => {
    try {
      const res = await fetch(`${CRAFT_BASE}/recipes?username=${username}`);
      const data = await res.json();
      setRecipes(data.recipes);
    } catch {
      /* handled elsewhere */
    }
  };

  const loadCompanion = async () => {
    try {
      const res = await fetch(`${COMPANION_BASE}/status?username=${username}`);
      const data = await res.json();
      setCompanions(data.companions);
      setEquippedId(data.equipped_companion_id);
      setCoins(data.coins);
    } catch {
      /* handled elsewhere */
    }
  };

  const loadAll = () => {
    loadCamp();
    loadCraft();
    loadCompanion();
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 3000);
    return () => clearInterval(interval);
  }, [username]);

  const gather = async (resource: string) => {
    setBusy(`gather-${resource}`);
    try {
      const res = await fetch(`${CAMP_BASE}/gather?username=${username}&resource=${resource}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : "Could not gather.");
      } else {
        const data = await res.json();
        setStatus(
          `+${data.amount_gained} ${resource}${data.weather_boosted ? " (weather boosted!)" : ""}`
        );
        loadAll();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusy(null);
    }
  };

  const upgrade = async () => {
    setBusy("upgrade");
    try {
      const res = await fetch(`${CAMP_BASE}/upgrade?username=${username}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : err.detail?.message ?? "Could not upgrade.");
      } else {
        const data = await res.json();
        setStatus(`Camp upgraded to level ${data.new_camp_level}!`);
        loadAll();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusy(null);
    }
  };

  const craft = async (id: number, name: string) => {
    setBusy(`craft-${id}`);
    try {
      const res = await fetch(`${CRAFT_BASE}/make?username=${username}&result_item_id=${id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : err.detail?.message ?? "Could not craft.");
      } else {
        setStatus(`Crafted ${name}!`);
        loadAll();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusy(null);
    }
  };

  const equipCompanion = async (id: number, name: string) => {
    setBusy(`companion-${id}`);
    try {
      const res = await fetch(`${COMPANION_BASE}/buy-and-equip?username=${username}&companion_id=${id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : err.detail?.message ?? "Could not equip.");
      } else {
        setStatus(`${name} equipped!`);
        loadAll();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Head>
        <title>VillageVerse | Camp</title>
        <meta name="description" content="Gather resources, upgrade your camp, craft items, and equip companions." />
      </Head>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Pirate camp</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-800">
                Camp level {camp?.camp_level ?? "…"}
              </h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              💰 {coins === null ? "…" : coins.toLocaleString()} coins
            </div>
          </div>

          {camp?.weather && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sky-50 p-4">
              <span className="text-3xl">{camp.weather.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {camp.weather.name}
                  {camp.weather.boosted_resource && ` — boosts ${camp.weather.boosted_resource} x${camp.weather.multiplier}`}
                </p>
                <p className="text-xs text-slate-500">{camp.weather.flavor}</p>
              </div>
            </div>
          )}

          {status && <p className="mt-3 text-sm font-medium text-amber-700">{status}</p>}
        </motion.section>

        <SectionCard title="Gather resources" subtitle="Each node needs time to respawn after gathering">
          <div className="grid gap-4 sm:grid-cols-3">
            {camp &&
              Object.entries(camp.gather_nodes).map(([resource, node]) => (
                <div key={resource} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 text-center">
                  <div className="text-3xl">{RESOURCE_EMOJI[resource]}</div>
                  <p className="mt-2 font-semibold text-slate-800">{node.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {camp.resources[resource as keyof typeof camp.resources]} {resource}
                  </p>
                  <button
                    onClick={() => gather(resource)}
                    disabled={!node.ready || busy === `gather-${resource}`}
                    className="mt-3 w-full rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {!node.ready ? `${node.seconds_left}s` : busy === `gather-${resource}` ? "Gathering…" : "Gather"}
                  </button>
                </div>
              ))}
          </div>
        </SectionCard>

        <SectionCard title="Camp upgrade" subtitle="Spend resources to raise your camp level">
          {camp?.next_upgrade ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Level {camp.next_upgrade.level} needs{" "}
                {Object.entries(camp.next_upgrade.cost).map(([r, v]) => `${v} ${r}`).join(", ")}
              </p>
              <button
                onClick={upgrade}
                disabled={busy === "upgrade"}
                className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy === "upgrade" ? "Upgrading…" : "Upgrade camp"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Camp is at max level.</p>
          )}
        </SectionCard>

        <SectionCard title="Crafting" subtitle="Turn resources into camp goods">
          <div className="grid gap-4 sm:grid-cols-3">
            {recipes.map((r) => (
              <div key={r.result_item_id} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4">
                <div className="text-3xl">{r.emoji}</div>
                <p className="mt-2 font-semibold text-slate-800">{r.name}</p>
                <p className="mt-1 text-xs text-slate-500">{r.description}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {Object.entries(r.cost).map(([res, amt]) => `${amt} ${res}`).join(", ")}
                </p>
                <button
                  onClick={() => craft(r.result_item_id, r.name)}
                  disabled={!r.can_afford || busy === `craft-${r.result_item_id}`}
                  className="mt-3 w-full rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busy === `craft-${r.result_item_id}` ? "Crafting…" : r.can_afford ? "Craft" : "Not enough"}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Companions" subtitle="Equip one companion for a passive bonus">
          <div className="grid gap-4 sm:grid-cols-3">
            {companions.map((c) => {
              const isEquipped = equippedId === c.id;
              return (
                <div key={c.id} className={`rounded-[1.25rem] border p-4 ${isEquipped ? "border-emerald-300 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                  <div className="text-3xl">{c.emoji}</div>
                  <p className="mt-2 font-semibold text-slate-800">{c.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{c.description}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{c.price} coins</p>
                  <button
                    onClick={() => equipCompanion(c.id, c.name)}
                    disabled={isEquipped || busy === `companion-${c.id}`}
                    className="mt-3 w-full rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isEquipped ? "Equipped" : busy === `companion-${c.id}` ? "Equipping…" : "Buy & Equip"}
                  </button>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
