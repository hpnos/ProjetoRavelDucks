"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listUserCollection } from "@/services/user-ducks-service";
import { CollectionDuckView } from "@/types/database";
import { getXpToNextLevel } from "@/lib/leveling";

export default function CollectionPage() {
  const { user, isLoading } = useAuthUser();

  const [collection, setCollection] = useState<CollectionDuckView[]>([]);
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);

  async function loadCollection(userId: string) {
    try {
      setIsLoadingCollection(true);

      const data = await listUserCollection(userId);

      setCollection(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCollection(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadCollection(user.uid);
    }

    if (!isLoading && !user) {
      setIsLoadingCollection(false);
    }
  }, [user, isLoading]);

  if (isLoading || isLoadingCollection) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Carregando coleção...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Entre para ver sua coleção</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Sua coleção é vinculada à sua conta.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Entrar
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Minha coleção
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Patinhos reais desbloqueados a partir dos pacotes abertos.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pacotes"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Abrir pacotes
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {collection.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {collection.reduce(
                (acc, item) => acc + item.userDuck.unlockedRewards.length,
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Maior nível
            </p>
            <p className="mt-2 text-3xl font-black text-yellow-400">
              {collection.length > 0
                ? Math.max(...collection.map((item) => item.userDuck.level))
                : 0}
            </p>
          </div>
        </section>

        {collection.length === 0 ? (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-xl">
            <h2 className="text-3xl font-black text-white">
              Nenhum pato desbloqueado ainda
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Abra pacotes para começar sua coleção.
            </p>

            <Link
              href="/pacotes"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver pacotes
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {collection.map((item) => {
              const xpInfo = getXpToNextLevel(
                item.userDuck.level,
                item.userDuck.xp
              );

              return (
                <article
                  key={item.userDuck.id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
                >
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-yellow-400/30 bg-yellow-400/10 text-6xl shadow-xl">
                      {item.duck.imageUrl ? (
                        <img
                          src={item.duck.imageUrl}
                          alt={item.duck.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "🦆"
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black text-white">
                      {item.duck.name}
                    </h2>

                    <p className="text-sm text-zinc-500">
                      Tema: {item.duck.theme}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-zinc-200">
                          Nível {item.userDuck.level}/{item.duck.maxLevel}
                        </span>

                        <span className="text-zinc-500">
                          {xpInfo.currentLevelXp}/{xpInfo.nextLevelXp} XP
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-yellow-400"
                          style={{ width: `${xpInfo.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm text-zinc-400">
                        Recompensas liberadas:{" "}
                        <strong className="text-white">
                          {item.userDuck.unlockedRewards.length}
                        </strong>
                      </p>
                    </div>

                    <Link
                      href={`/patos/${item.duck.id}`}
                      className="mt-6 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
                    >
                      Ver progresso
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
