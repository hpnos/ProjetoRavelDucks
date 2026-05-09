import { UserIsland } from "@/types/island";
import { IslandGalleryCard } from "./IslandGalleryCard";

interface IslandGalleryGridProps {
  islands: UserIsland[];
}

export function IslandGalleryGrid({ islands }: IslandGalleryGridProps) {
  if (islands.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
        <h2 className="text-2xl font-black text-white">
          Nenhuma ilha encontrada
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Quando os jogadores criarem suas ilhas, elas aparecerão aqui.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {islands.map((island) => (
        <IslandGalleryCard key={island.id} island={island} />
      ))}
    </section>
  );
}
