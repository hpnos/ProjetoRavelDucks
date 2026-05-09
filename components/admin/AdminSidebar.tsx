import Link from "next/link";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/patos",
    label: "Patos",
  },
  {
    href: "/admin/cartas",
    label: "Cartas",
  },
  {
    href: "/admin/pacotes",
    label: "Pacotes",
  },
  {
    href: "/admin/liberar-pacote",
    label: "Liberar pacote",
  },
  {
    href: "/admin/ravelboxes",
    label: "Ravelboxes",
  },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl lg:sticky lg:top-6 lg:h-fit">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Admin</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <Link
          href="/"
          className="block rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
