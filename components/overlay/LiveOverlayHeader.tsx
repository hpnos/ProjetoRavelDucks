export function LiveOverlayHeader() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-yellow-400/30 bg-black/70 px-5 py-4 shadow-2xl backdrop-blur">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-1 text-2xl font-black text-white">
          Eventos da Live
        </h1>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/40 bg-yellow-400/10 text-3xl">
        🦆
      </div>
    </header>
  );
}
