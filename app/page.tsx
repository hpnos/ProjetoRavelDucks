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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/login"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            Criar conta
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
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
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
            href="/admin"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Admin
          </Link>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/overlay/live"
            className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 px-6 py-3 font-bold text-emerald-400 transition hover:border-emerald-400"
          >
            Overlay (Completo)
          </Link>

          <Link
            href="/overlay/live/compact"
            className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 px-6 py-3 font-bold text-emerald-400 transition hover:border-emerald-400"
          >
            Overlay (Compacto)
          </Link>

          <Link
            href="/overlay/live/alert"
            className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 px-6 py-3 font-bold text-emerald-400 transition hover:border-emerald-400"
          >
            Overlay (Alerta)
          </Link>
        </div>
      </section>
    </main>
  );
}
