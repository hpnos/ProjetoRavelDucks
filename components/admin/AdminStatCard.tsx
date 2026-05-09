interface AdminStatCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>

      {helper && <p className="mt-2 text-sm text-zinc-500">{helper}</p>}
    </div>
  );
}
