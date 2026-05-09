"use client";

import { useLiveEvents } from "@/hooks/use-live-events";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";

export default function AdminLiveEventsPage() {
  const { events, isLoading } = useLiveEvents(20);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Eventos da Live"
        description="Veja os eventos mais recentes enviados para o overlay da live."
      />

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Evento
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Usuário
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Tipo
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Raridade
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Horário
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-zinc-400"
                  >
                    Carregando eventos...
                  </td>
                </tr>
              )}

              {!isLoading &&
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-white">
                        {event.icon} {event.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {event.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      @{event.username}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.type}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.rarity ?? "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
