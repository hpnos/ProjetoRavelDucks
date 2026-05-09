"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { loginWithEmail } from "@/services/auth-service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      await loginWithEmail({
        email,
        password,
      });

      setMessage("Login realizado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao entrar. Verifique e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-2 text-3xl font-black">Entrar</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Entre para acessar sua coleção, pacotes e ilha.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              E-mail
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Senha
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Sua senha"
              required
            />
          </div>

          {message && (
            <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
              {message}
            </p>
          )}

          <button
            disabled={isLoading}
            className="rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href="/cadastro"
          className="mt-5 block text-center text-sm font-bold text-yellow-400"
        >
          Criar conta
        </Link>
      </section>
    </main>
  );
}
