"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { createDuck } from "@/services/ducks-service";

export default function NewDuckPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("");
  const [rarity, setRarity] = useState("common");
  const [maxLevel, setMaxLevel] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  function generateIdFromSlug(value: string) {
    return value.startsWith("duck-") ? value : `duck-${value}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      const safeSlug = slug.trim().toLowerCase().replaceAll(" ", "-");
      const id = generateIdFromSlug(safeSlug);

      await createDuck({
        id,
        name,
        slug: safeSlug,
        theme,
        rarity: rarity as "common" | "rare" | "epic" | "legendary",
        maxLevel: Number(maxLevel),
        imageUrl: imageUrl.trim() || undefined,
        gifUrl: gifUrl.trim() || undefined,
      });

      setMessage("Pato criado com sucesso.");
      router.push("/admin/patos");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar pato.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Novo pato"
        description="Cadastre um novo pato colecionável no Firestore."
      />

      <AdminFormCard>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <AdminInput
            label="Nome"
            value={name}
            onChange={setName}
            placeholder="Ex: Pato Apolo"
            required
          />

          <AdminInput
            label="Slug"
            value={slug}
            onChange={setSlug}
            placeholder="Ex: pato-apolo"
            required
          />

          <AdminInput
            label="Tema"
            value={theme}
            onChange={setTheme}
            placeholder="Ex: Apolo"
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

          <AdminInput
            label="Nível máximo"
            value={maxLevel}
            onChange={setMaxLevel}
            type="number"
            required
          />

          <AdminInput
            label="URL da imagem do pato"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Ex: https://res.cloudinary.com/.../duck-apolo.png"
          />

          <AdminInput
            label="URL do GIF do pato para ilha"
            value={gifUrl}
            onChange={setGifUrl}
            placeholder="Opcional. Ex: https://res.cloudinary.com/.../duck-apolo.gif"
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
            {isSaving ? "Criando..." : "Criar pato"}
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
