import { AdminStatus } from "@/types/admin";

interface AdminStatusBadgeProps {
  status: AdminStatus | "delivered";
}

const statusLabel = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  delivered: "Entregue",
};

const statusStyle = {
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  inactive: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  pending: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
  delivered: "border-sky-400/40 bg-sky-400/10 text-sky-300",
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase",
        statusStyle[status],
      ].join(" ")}
    >
      {statusLabel[status]}
    </span>
  );
}
