import { motion } from "framer-motion";

export default function IslandScene() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 p-6 shadow-[0_30px_80px_rgba(14,116,144,0.16)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_35%)]" />
      <motion.div
        initial={{ y: 0, opacity: 0.9 }}
        animate={{ y: [0, -14, 0], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-8 top-8 h-16 w-24 rounded-full bg-white/60 blur-2xl"
      />
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: [0, 18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 top-10 h-10 w-24 rounded-full bg-white/70 blur-xl"
      />
      <motion.div
        className="absolute left-1/2 top-10 h-4 w-4 rounded-full bg-amber-200"
        animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-24 top-16 h-3 w-3 rounded-full bg-pink-300"
        animate={{ y: [0, -8, 0], x: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-16 left-6 h-3 w-3 rounded-full bg-emerald-200"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative z-10 flex min-h-[320px] flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            🌤️ Sunny • 72°F
          </div>
          <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            ✨ Daily quests live
          </div>
        </div>
        <div className="relative mx-auto mt-10 flex h-56 w-full max-w-2xl items-end justify-center">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-x-[8%] bottom-6 h-24 rounded-[45%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4),_rgba(70,185,255,0.15))] blur-2xl"
          />
          <div className="absolute bottom-8 h-36 w-72 rounded-[45%_45%_40%_40%] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_40px_rgba(16,185,129,0.24)]" />
          <div className="absolute bottom-8 h-40 w-96 rounded-[45%_45%_35%_35%] bg-gradient-to-br from-slate-100/70 to-amber-100/80 shadow-inner" />
          <div className="absolute bottom-12 left-[22%] h-16 w-16 rounded-b-full bg-amber-300" />
          <div className="absolute bottom-12 right-[20%] h-18 w-18 rounded-b-full bg-amber-300" />
          <div className="absolute bottom-16 left-[30%] h-20 w-20 rounded-full bg-sky-500/80" />
          <div className="absolute bottom-20 right-[28%] h-14 w-14 rounded-full bg-sky-500/70" />
          <div className="absolute bottom-20 left-[45%] h-24 w-24 rounded-full bg-white/70" />
          <div className="absolute bottom-5 h-24 w-[90%] rounded-[50%] border border-white/60 bg-gradient-to-b from-sky-300/70 to-sky-500/70 shadow-[0_20px_30px_rgba(56,189,248,0.15)]" />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-28 h-20 w-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 shadow-lg"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.2, repeat: Infinity }}
            className="absolute bottom-32 left-[40%] h-12 w-12 rounded-full bg-pink-300"
          />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
          <div className="rounded-full border border-white/70 bg-white/50 px-4 py-2">🌿 12 quests nearby</div>
          <div className="rounded-full border border-white/70 bg-white/50 px-4 py-2">🐦 Birdsong active</div>
        </div>
      </div>
    </div>
  );
}
