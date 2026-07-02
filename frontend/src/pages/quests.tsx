import Head from "next/head";
import { motion } from "framer-motion";
import SectionCard from "../components/SectionCard";

const quests = [
  { title: "Morning Bloom Hunt", reward: "150 coins", detail: "Collect three flowers across the meadow." },
  { title: "Moonlit Fish Run", reward: "300 coins", detail: "Catch a rare fish before sundown." },
  { title: "Crafting Calm", reward: "1 rare recipe", detail: "Complete a new home décor project." },
];

export default function QuestsPage() {
  return (
    <>
      <Head>
        <title>VillageVerse | Quests</title>
        <meta name="description" content="Follow dreamy quests and adventures across the island." />
      </Head>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Daily adventures</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800">A gentle set of quests keeps your island feeling alive.</h1>
        </motion.section>

        <SectionCard title="Quest board" subtitle="Your next island moment">
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.title} className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{quest.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{quest.detail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">{quest.reward}</span>
                  <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Start</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
