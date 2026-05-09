"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listActiveCards } from "@/services/cards-service";
import { CardDocument } from "@/types/database";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const typeLabel = {
  duck: "Pato",
  duck_xp: "XP",
  island_item: "Item de ilha",
  accessory: "Acessório",
  border: "Borda",
  pin: "Pin",
  digital_art: "Arte digital",
  ravelbox: "Ravelbox",
};

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCards() {
    try {
      setIsLoading(true);
      const data = await listActiveCards();
      setCards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Cartas"
        description="Cartas reais cadastradas no Firestore e disponíveis para pacotes."
        actionLabel="Nova carta"
        actionHref="/admin/cartas/nova"
      />

      <AdminDataTable headers={["Imagem", "Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando cartas...
            </td>
          </tr>
        )}

        {!isLoading && cards.length === 0 && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma carta cadastrada.
            </td>
          </tr>
        )}

        {!isLoading &&
          cards.map((card) => (
            <tr key={card.id}>
              <td className="px-5 py-4">
                <div className="flex h-16 w-12 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🎴</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {card.name}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {typeLabel[card.type]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {rarityLabel[card.rarity]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {card.duckId ?? "-"}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={card.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
