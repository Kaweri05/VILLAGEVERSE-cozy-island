import Head from "next/head";
import { motion } from "framer-motion";
import SectionCard from "../components/SectionCard";

const stats = [
  { label: "Active users", value: "1,248" },
  { label: "Marketplace sales", value: "$42k" },
  { label: "Average happiness", value: "91%" },
];

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>VillageVerse | Admin</title>
        <meta name="description" content="Administrative dashboard for VillageVerse." />
      </Head>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800">Monitor players, rewards, and marketplace health in one place.</h1>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="User management" subtitle="Moderation and player insights">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">Mina • Premium player</div>
              <div className="rounded-2xl bg-slate-50 p-4">Sol • Event organizer</div>
            </div>
          </SectionCard>

          <SectionCard title="Marketplace management" subtitle="Stock, pricing, and featured items">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">Lantern stock: 8</div>
              <div className="rounded-2xl bg-slate-50 p-4">Seasonal bloom featured</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
