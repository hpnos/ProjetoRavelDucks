import { CollectionDuck } from "@/types/collection";
import { DuckCollectionCard } from "./DuckCollectionCard";

interface DuckCollectionGridProps {
  ducks: CollectionDuck[];
}

export function DuckCollectionGrid({ ducks }: DuckCollectionGridProps) {
  if (ducks.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
        <h2 className="text-2xl font-black text-white">
          Nenhum pato desbloqueado
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Abra pacotes durante a live para começar sua coleção.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {ducks.map((duck) => (
        <DuckCollectionCard key={duck.id} duck={duck} />
      ))}
    </section>
  );
}
