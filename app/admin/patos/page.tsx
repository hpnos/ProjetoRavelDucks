"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listDucks } from "@/services/ducks-service";
import { DuckDocument } from "@/types/database";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export default function AdminDucksPage() {
  const [ducks, setDucks] = useState<DuckDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDucks() {
    try {
      setIsLoading(true);
      const data = await listDucks();
      setDucks(data as DuckDocument[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDucks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Patos"
        description="Gerencie os patinhos colecionáveis cadastrados no Firestore."
        actionLabel="Novo pato"
        actionHref="/admin/patos/novo"
      />

      <AdminDataTable headers={["Imagem", "Nome", "Tema", "Raridade", "Nível máximo", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando patos...
            </td>
          </tr>
        )}

        {!isLoading && ducks.length === 0 && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum pato cadastrado.
            </td>
          </tr>
        )}

        {!isLoading &&
          ducks.map((duck) => (
            <tr key={duck.id}>
              <td className="px-5 py-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
                  {duck.imageUrl ? (
                    <img
                      src={duck.imageUrl}
                      alt={duck.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🦆</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {duck.name}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {duck.theme}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {rarityLabel[duck.rarity]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {duck.maxLevel}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={duck.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
