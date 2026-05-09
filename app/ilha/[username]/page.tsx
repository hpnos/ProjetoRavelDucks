import Link from "next/link";
import { IslandPreview } from "@/components/island/IslandPreview";
import { IslandProfileCard } from "@/components/island/IslandProfileCard";
import { IslandStatsCard } from "@/components/island/IslandStatsCard";
import { mockIsland } from "@/lib/island-mock-data";

interface IslandPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function IslandPage({ params }: IslandPageProps) {
  const { username } = await params;
  
  const island = {
    ...mockIsland,
    owner: {
      ...mockIsland.owner,
      username: username,
      displayName:
        username.charAt(0).toUpperCase() + username.slice(1),
    },
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">
              Ilha pública
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Veja os patinhos, recompensas e itens desbloqueados por este
              colecionador.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/patos/duck-junkrat"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver progresso
            </Link>
          </div>
        </header>

        <IslandStatsCard stats={island.collectionStats} />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <IslandProfileCard
            owner={island.owner}
            backgroundName={island.backgroundName}
          />

          <IslandPreview island={island} />
        </div>
      </div>
    </main>
  );
}
