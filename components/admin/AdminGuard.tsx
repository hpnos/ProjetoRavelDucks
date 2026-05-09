"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAdminUser } from "@/hooks/use-admin-user";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isLoading, isAuthenticated, isAdmin, profile } = useAdminUser();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Verificando permissões...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Acesso restrito</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Você precisa estar logado para acessar o painel admin.
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

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Sem permissão</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Sua conta está logada como{" "}
            <strong className="text-white">{profile?.displayName}</strong>, mas
            não possui permissão de admin.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Voltar ao site
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
