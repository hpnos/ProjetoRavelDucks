import { ReactNode } from "react";

interface AdminFormCardProps {
  children: ReactNode;
}

export function AdminFormCard({ children }: AdminFormCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      {children}
    </section>
  );
}
