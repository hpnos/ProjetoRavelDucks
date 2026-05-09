"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listActivePacks } from "@/services/packs-service";
import { PackDocument } from "@/types/database";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<PackDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPacks() {
    try {
      setIsLoading(true);
      const data = await listActivePacks();
      setPacks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPacks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Pacotes"
        description="Modelos de pacotes reais cadastrados no Firestore."
        actionLabel="Novo pacote"
        actionHref="/admin/pacotes/novo"
      />

      <AdminDataTable headers={["Imagem", "Nome", "Cartas por pacote", "Cartas no pool", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando pacotes...
            </td>
          </tr>
        )}

        {!isLoading && packs.length === 0 && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum pacote cadastrado.
            </td>
          </tr>
        )}

        {!isLoading &&
          packs.map((pack) => (
            <tr key={pack.id}>
              <td className="px-5 py-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                  {pack.imageUrl ? (
                    <img
                      src={pack.imageUrl}
                      alt={pack.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🎴</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">{pack.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{pack.description}</p>
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {pack.cardsQuantity}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {pack.cardPool.length}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={pack.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
