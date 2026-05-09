"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { registerWithEmail } from "@/services/auth-service";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      await registerWithEmail({
        displayName,
        username,
        email,
        password,
      });

      setMessage("Cadastro realizado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar conta. Verifique os dados e tente novamente.");
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

        <h1 className="mt-2 text-3xl font-black">Criar conta</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Crie sua conta para começar a colecionar patinhos.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Nome
            </label>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Ex: Guilherme"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Ex: guilherme"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
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
            {isLoading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-5 block text-center text-sm font-bold text-yellow-400"
        >
          Já tenho conta
        </Link>
      </section>
    </main>
  );
}
