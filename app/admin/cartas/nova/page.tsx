"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminTextarea } from "@/components/admin/AdminTextarea";
import { createCard } from "@/services/cards-service";
import { listDucks } from "@/services/ducks-service";
import { DuckDocument } from "@/types/database";

export default function NewCardPage() {
  const router = useRouter();

  const [ducks, setDucks] = useState<DuckDocument[]>([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("duck");
  const [rarity, setRarity] = useState("common");
  const [duckId, setDuckId] = useState("");
  const [xpAmount, setXpAmount] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDucks() {
    const data = await listDucks();
    setDucks(data as DuckDocument[]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      await createCard({
        id,
        name,
        description,
        type: type as
          | "duck"
          | "duck_xp"
          | "island_item"
          | "accessory"
          | "border"
          | "pin"
          | "digital_art"
          | "ravelbox",
        rarity: rarity as "common" | "rare" | "epic" | "legendary",
        duckId: duckId || undefined,
        xpAmount: Number(xpAmount) > 0 ? Number(xpAmount) : undefined,
        imageUrl: imageUrl.trim() || undefined,
      });

      setMessage("Carta criada com sucesso.");
      router.push("/admin/cartas");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar carta.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    loadDucks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Nova carta"
        description="Cadastre uma carta real para entrar nos pacotes."
      />

      <AdminFormCard>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <AdminInput
            label="ID da carta"
            value={id}
            onChange={setId}
            placeholder="Ex: card-duck-apolo"
            required
          />

          <AdminInput
            label="Nome"
            value={name}
            onChange={setName}
            placeholder="Ex: Apolo"
            required
          />

          <AdminTextarea
            label="Descrição"
            value={description}
            onChange={setDescription}
            placeholder="Descreva o que essa carta faz."
            required
          />

          <AdminSelect
            label="Tipo"
            value={type}
            onChange={setType}
            options={[
              { label: "Pato", value: "duck" },
              { label: "XP de pato", value: "duck_xp" },
              { label: "Item de ilha", value: "island_item" },
              { label: "Acessório", value: "accessory" },
              { label: "Borda", value: "border" },
              { label: "Pin", value: "pin" },
              { label: "Arte digital", value: "digital_art" },
              { label: "Ravelbox", value: "ravelbox" },
            ]}
            required
          />

          <AdminSelect
            label="Raridade"
            value={rarity}
            onChange={setRarity}
            options={[
              { label: "Comum", value: "common" },
              { label: "Raro", value: "rare" },
              { label: "Épico", value: "epic" },
              { label: "Lendário", value: "legendary" },
            ]}
            required
          />

          <AdminSelect
            label="Pato relacionado"
            value={duckId}
            onChange={setDuckId}
            options={[
              { label: "Nenhum", value: "" },
              ...ducks.map((duck) => ({
                label: duck.name,
                value: duck.id,
              })),
            ]}
          />

          <AdminInput
            label="XP concedido"
            value={xpAmount}
            onChange={setXpAmount}
            type="number"
            placeholder="Ex: 100"
          />

          <AdminInput
            label="URL da imagem da carta"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Ex: https://res.cloudinary.com/.../apolo.png"
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
            {isSaving ? "Criando..." : "Criar carta"}
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
