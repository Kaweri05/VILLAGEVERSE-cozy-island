import Head from "next/head";
import { motion } from "framer-motion";
import SectionCard from "../components/SectionCard";
import { inventoryItems } from "../data/mockData";

export default function InventoryPage() {
  return (
    <>
      <Head>
        <title>VillageVerse | Inventory</title>
        <meta name="description" content="Manage your island inventory with a cozy, polished flow." />
      </Head>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Inventory</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-800">Keep your treasured island goods beautifully organized.</h1>
            </div>
            <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">🧺 5 active items</div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Collected items" subtitle="Stack, favorite, and reserve with ease">
            <div className="grid gap-4 sm:grid-cols-2">
              {inventoryItems.map((item) => (
                <motion.article key={item.id} whileHover={{ y: -4 }} className="rounded-[1.3rem] border border-slate-100 bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{item.emoji}</div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">{item.category}</span>
                  </div>
                  <p className="mt-3 font-semibold text-slate-800">{item.name}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>Qty {item.quantity}</span>
                    <span>{item.rarity}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{item.value} coins</span>
                    <button className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">Preview</button>
                  </div>
                </motion.article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Storage overview" subtitle="Reserve space and favorites at a glance">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Reserved storage</p>
                <p className="mt-2 text-xl font-semibold text-slate-800">3 items</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Favorites</p>
                <p className="mt-2 text-xl font-semibold text-slate-800">2 prized pieces</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Quick access</p>
                <p className="mt-2 text-xl font-semibold text-slate-800">Garden tools ready</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
