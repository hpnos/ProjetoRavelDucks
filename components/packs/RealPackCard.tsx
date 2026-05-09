import { ResolvedGrantedPack } from "@/types/database";

interface RealPackCardProps {
  grantedPack: ResolvedGrantedPack;
  onOpen: (grantedPack: ResolvedGrantedPack) => void;
  isOpening?: boolean;
}

const reasonLabel = {
  live_purchase: "Live",
  event_reward: "Evento",
  manual_bonus: "Bônus",
  admin: "Admin",
};

const statusLabel = {
  available: "Disponível",
  opened: "Aberto",
  expired: "Expirado",
};

const statusStyle = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  opened: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  expired: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function RealPackCard({
  grantedPack,
  onOpen,
  isOpening,
}: RealPackCardProps) {
  const isAvailable = grantedPack.status === "available";

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-yellow-500/10">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-yellow-400/20 via-orange-500/10 to-black">
        <div className="absolute left-4 top-4 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-300">
          {reasonLabel[grantedPack.reason]}
        </div>

        <div
          className={[
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold uppercase",
            statusStyle[grantedPack.status],
          ].join(" ")}
        >
          {statusLabel[grantedPack.status]}
        </div>

        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-yellow-400/40 bg-zinc-950/70 text-6xl shadow-xl">
          {grantedPack.pack.imageUrl ? (
            <img
              src={grantedPack.pack.imageUrl}
              alt={grantedPack.pack.name}
              className="h-full w-full object-cover"
            />
          ) : (
            "🎴"
          )}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-black text-white">
          {grantedPack.pack.name}
        </h2>

        <p className="mt-2 min-h-[44px] text-sm text-zinc-400">
          {grantedPack.pack.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Cartas
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {grantedPack.pack.cardsQuantity}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Pool
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {grantedPack.pack.cardPool.length}
            </p>
          </div>
        </div>

        <button
          disabled={!isAvailable || isOpening}
          onClick={() => onOpen(grantedPack)}
          className={[
            "mt-6 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-black transition",
            isAvailable
              ? "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500",
          ].join(" ")}
        >
          {isOpening ? "Abrindo..." : isAvailable ? "Abrir pacote" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
