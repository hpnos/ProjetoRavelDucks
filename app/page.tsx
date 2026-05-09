import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Plataforma de patinhos colecionáveis
        </h1>

        <p className="mt-4 text-zinc-400">
          Abra pacotes, colecione patos, evolua personagens e personalize sua
          ilha pública para a comunidade da live.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Pato
          </Link>

          <Link
            href="/ilha/ravel"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Ilha
          </Link>

          <Link
            href="/ilhas"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Galeria
          </Link>

          <Link
            href="/colecao"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Coleção
          </Link>

          <Link
            href="/pacotes"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Pacotes
          </Link>

          <Link
            href="/admin"
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
