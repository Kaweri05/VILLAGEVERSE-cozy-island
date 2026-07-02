type SectionCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
