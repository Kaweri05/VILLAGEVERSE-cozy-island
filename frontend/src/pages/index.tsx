import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import FeatureCard from "../components/FeatureCard";
import IslandScene from "../components/IslandScene";
import SectionCard from "../components/SectionCard";
import { dailyRewards, featureCards, shopItems, villagers } from "../data/mockData";

export default function Home() {
  return (
    <>
      <Head>
        <title>VillageVerse | Cozy Island Life</title>
        <meta name="description" content="A premium cozy island life experience with animated seasons, smart shopping, and a polished inventory." />
      </Head>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm text-sky-700">
            <span className="rounded-full bg-sky-100 px-3 py-1">🌅 New season live</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1">☁️ Soft weather updates</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl">
            Welcome to a living island where every day feels handcrafted.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            VillageVerse blends relaxing life sim energy with premium, animated design. Collect, craft, and discover your perfect island rhythm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-1">
              Explore the shop
            </Link>
            <Link href="/inventory" className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-1">
              Open inventory
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Island rating", value: "4.9/5" },
              { label: "Coins", value: "2,450" },
              { label: "Current quest", value: "Sunlit Garden" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <IslandScene />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Daily rewards" subtitle="Small wins, big charm">
          <div className="grid gap-3 sm:grid-cols-3">
            {dailyRewards.map((reward) => (
              <div key={reward.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">{reward.label}</p>
                <p className="mt-2 text-sm text-slate-500">{reward.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Seasonal event" subtitle="The moonlight market is opening soon">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-200 via-orange-100 to-pink-200 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">Tonight only</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-800">Starlight market</h3>
            <p className="mt-2 text-sm text-slate-700">Exclusive lanterns, rare flowers, and warm music drift through the island plaza.</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-white/70 px-3 py-1">⏳ 03:42:11</span>
              <span className="rounded-full bg-white/70 px-3 py-1">🌙 Live ambience</span>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Featured items" subtitle="Curated for your island mood">
          <div className="grid gap-4 sm:grid-cols-2">
            {shopItems.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{item.emoji}</div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">{item.category}</span>
                </div>
                <p className="mt-3 font-semibold text-slate-800">{item.name}</p>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.price} coins</span>
                  <span>{item.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Popular villagers" subtitle="Friendly faces you’ll meet again">
          <div className="space-y-3">
            {villagers.map((villager) => (
              <div key={villager.name} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 text-xl">
                    {villager.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{villager.name}</p>
                    <p className="text-sm text-slate-500">{villager.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">“{villager.quote}”</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="AI recommendations" subtitle="Tailored for your next cozy upgrade">
          <div className="rounded-[1.5rem] border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50 p-5">
            <p className="text-sm text-slate-600">Based on your recent garden and storage activity, your island companion suggests:</p>
            <div className="mt-4 rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-lg font-semibold text-slate-800">Moonlit herb planter</p>
              <p className="mt-2 text-sm text-slate-500">Brighten your porch and boost happiness with a soft nighttime glow.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Why VillageVerse feels premium" subtitle="Every detail was composed for calm, delight, and momentum">
          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} />
            ))}
          </div>
        </SectionCard>
      </section>
    </>
  );
}
