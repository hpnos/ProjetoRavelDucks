"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RealOpenPackModal } from "@/components/packs/RealOpenPackModal";
import { RealPackCard } from "@/components/packs/RealPackCard";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listGrantedPacksByUser } from "@/services/granted-packs-service";
import { openGrantedPack } from "@/services/pack-openings-service";
import { CardDocument, ResolvedGrantedPack } from "@/types/database";

export default function PacksPage() {
  const { user, isLoading: isAuthLoading } = useAuthUser();

  const [grantedPacks, setGrantedPacks] = useState<ResolvedGrantedPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<ResolvedGrantedPack | null>(
    null
  );
  const [receivedCards, setReceivedCards] = useState<CardDocument[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [modalError, setModalError] = useState("");
  const [resultMessages, setResultMessages] = useState<string[]>([]);

  const availablePacks = grantedPacks.filter(
    (pack) => pack.status === "available"
  );

  const openedPacks = grantedPacks.filter((pack) => pack.status === "opened");

  async function loadPacks(userId: string) {
    try {
      setIsLoadingPacks(true);

      const packs = await listGrantedPacksByUser(userId);

      setGrantedPacks(packs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPacks(false);
    }
  }

  async function handleOpenPack(pack: ResolvedGrantedPack) {
    if (!user) {
      return;
    }

    try {
      setIsOpening(true);
      setModalError("");
      setSelectedPack(pack);

      const result = await openGrantedPack({
        userId: user.uid,
        grantedPackId: pack.id,
      });

      setReceivedCards(result.cards);
      setResultMessages(result.messages ?? []);

      await loadPacks(user.uid);
    } catch (error) {
      console.error(error);
      setModalError(
        error instanceof Error
          ? error.message
          : "Erro ao abrir pacote. Tente novamente."
      );
    } finally {
      setIsOpening(false);
    }
  }

  function handleCloseModal() {
    setSelectedPack(null);
    setReceivedCards([]);
    setModalError("");
    setResultMessages([]);
  }

  useEffect(() => {
    if (user) {
      loadPacks(user.uid);
    }

    if (!isAuthLoading && !user) {
      setIsLoadingPacks(false);
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || isLoadingPacks) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Carregando pacotes...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Entre para ver seus pacotes</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Os pacotes são vinculados à sua conta. Faça login para visualizar
            os pacotes liberados pelo Ravel.
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
              Meus pacotes
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Pacotes reais liberados pelo Ravel para sua conta.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/colecao"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Coleção
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Disponíveis
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {availablePacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Abertos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {openedPacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {grantedPacks.length}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Pacotes disponíveis
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Abra os pacotes liberados para sua conta.
            </p>
          </div>

          {availablePacks.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
              <h3 className="text-2xl font-black text-white">
                Nenhum pacote disponível
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Quando o Ravel liberar um pacote para você, ele aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availablePacks.map((pack) => (
                <RealPackCard
                  key={pack.id}
                  grantedPack={pack}
                  onOpen={handleOpenPack}
                  isOpening={isOpening}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Histórico de pacotes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pacotes já abertos.
            </p>
          </div>

          {openedPacks.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
              <h3 className="text-2xl font-black text-white">
                Nenhum pacote aberto ainda
              </h3>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {openedPacks.map((pack) => (
                <RealPackCard
                  key={pack.id}
                  grantedPack={pack}
                  onOpen={handleOpenPack}
                  isOpening={isOpening}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <RealOpenPackModal
        pack={selectedPack}
        cards={receivedCards}
        messages={resultMessages}
        error={modalError}
        onClose={handleCloseModal}
      />
    </main>
  );
}
