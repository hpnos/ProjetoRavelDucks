"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCheckboxList } from "@/components/admin/AdminCheckboxList";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminTextarea } from "@/components/admin/AdminTextarea";
import { listActiveCards } from "@/services/cards-service";
import { createPack } from "@/services/packs-service";
import { CardDocument } from "@/types/database";

export default function NewPackPage() {
  const router = useRouter();

  const [cards, setCards] = useState<CardDocument[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cardsQuantity, setCardsQuantity] = useState("4");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadCards() {
    const data = await listActiveCards();
    setCards(data);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      if (selectedCards.length === 0) {
        setMessage("Selecione pelo menos uma carta para o pacote.");
        return;
      }

      await createPack({
        id,
        name,
        description,
        cardsQuantity: Number(cardsQuantity),
        cardPool: selectedCards,
        imageUrl: imageUrl.trim() || undefined,
      });

      setMessage("Pacote criado com sucesso.");
      router.push("/admin/pacotes");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar pacote.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Novo pacote"
        description="Crie um pacote e selecione quais cartas podem sair nele."
      />

      <AdminFormCard>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <AdminInput
            label="ID do pacote"
            value={id}
            onChange={setId}
            placeholder="Ex: pack-apolo"
            required
          />

          <AdminInput
            label="Nome"
            value={name}
            onChange={setName}
            placeholder="Ex: Pacote Apolo"
            required
          />

          <AdminTextarea
            label="Descrição"
            value={description}
            onChange={setDescription}
            placeholder="Descreva o pacote."
            required
          />

          <AdminInput
            label="Quantidade de cartas por abertura"
            value={cardsQuantity}
            onChange={setCardsQuantity}
            type="number"
            required
          />

          <AdminInput
            label="URL da imagem do pacote"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Ex: https://res.cloudinary.com/.../pack-apolo.png"
          />

          <AdminCheckboxList
            label="Cartas do pacote"
            selectedValues={selectedCards}
            onChange={setSelectedCards}
            options={cards.map((card) => ({
              label: card.name,
              value: card.id,
              helper: `${card.type} • ${card.rarity}`,
            }))}
          />

          {message && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Criando..." : "Criar pacote"}
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
