type FeatureCardProps = {
  title: string;
  description: string;
  icon?: string;
};

export default function FeatureCard({ title, description, icon = "✦" }: FeatureCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(14,116,144,0.14)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-emerald-300 text-xl shadow-sm">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-800">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
