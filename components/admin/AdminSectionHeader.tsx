interface AdminSectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
}

export function AdminSectionHeader({
  title,
  description,
  actionLabel,
}: AdminSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Painel Admin
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">{title}</h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          {description}
        </p>
      </div>

      {actionLabel && (
        <button className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300">
          {actionLabel}
        </button>
      )}
    </header>
  );
}
