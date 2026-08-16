import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionCard from "../components/SectionCard";

const API_ROOT = process.env.NEXT_PUBLIC_API_BASE || "";
const API_BASE = `${API_ROOT}/api/game/quests`;

function getUsername() {
  if (typeof window === "undefined") return "guest";
  let name = window.localStorage.getItem("villageverse-username");
  if (!name) {
    name = "guest";
    window.localStorage.setItem("villageverse-username", name);
  }
  return name;
}

type Quest = {
  id: number;
  title: string;
  detail: string;
  reward_coins: number;
  duration_seconds: number;
  state: "not_started" | "in_progress" | "ready_to_claim" | "completed";
  seconds_left: number | null;
};

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [coins, setCoins] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const username = useMemo(getUsername, []);

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE}/status?username=${username}`);
      const data = await res.json();
      setQuests(data.quests);
      setCoins(data.coins);
    } catch {
      setStatus("Could not reach the backend.");
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000); // refresh countdowns every 3s
    return () => clearInterval(interval);
  }, [username]);

  const handleStart = async (id: number) => {
    setBusyId(id);
    try {
      const res = await fetch(`${API_BASE}/start?username=${username}&quest_id=${id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : "Could not start quest.");
      } else {
        setStatus("Quest started!");
        await load();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusyId(null);
    }
  };

  const handleClaim = async (id: number) => {
    setBusyId(id);
    try {
      const res = await fetch(`${API_BASE}/claim?username=${username}&quest_id=${id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setStatus(typeof err.detail === "string" ? err.detail : "Could not claim quest.");
      } else {
        const data = await res.json();
        setStatus(`Quest complete! +${data.coins_awarded} coins.`);
        await load();
      }
    } catch {
      setStatus("Could not reach the backend.");
    } finally {
      setBusyId(null);
    }
  };

  const buttonFor = (q: Quest) => {
    if (q.state === "not_started") {
      return (
        <button
          onClick={() => handleStart(q.id)}
          disabled={busyId === q.id}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busyId === q.id ? "Starting…" : "Start"}
        </button>
      );
    }
    if (q.state === "in_progress") {
      return (
        <button disabled className="rounded-full bg-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">
          {q.seconds_left}s left…
        </button>
      );
    }
    if (q.state === "ready_to_claim") {
      return (
        <button
          onClick={() => handleClaim(q.id)}
          disabled={busyId === q.id}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busyId === q.id ? "Claiming…" : "Claim reward"}
        </button>
      );
    }
    return (
      <button disabled className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
        Completed
      </button>
    );
  };

  return (
    <>
      <Head>
        <title>VillageVerse | Quests</title>
        <meta name="description" content="Follow dreamy quests and adventures across the island." />
      </Head>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Daily adventures</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-800">A gentle set of quests keeps your island feeling alive.</h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              💰 {coins === null ? "…" : coins.toLocaleString()} coins
            </div>
          </div>
          {status && <p className="mt-3 text-sm font-medium text-amber-700">{status}</p>}
        </motion.section>

        <SectionCard title="Quest board" subtitle="Your next island moment">
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{quest.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{quest.detail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">{quest.reward_coins} coins</span>
                  {buttonFor(quest)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
