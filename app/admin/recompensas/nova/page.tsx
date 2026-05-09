"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormCard } from "@/components/admin/AdminFormCard";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminTextarea } from "@/components/admin/AdminTextarea";
import { listDucks } from "@/services/ducks-service";
import { createDuckReward } from "@/services/duck-rewards-service";
import { DuckDocument } from "@/types/database";

export default function NewRewardPage() {
  const router = useRouter();

  const [ducks, setDucks] = useState<DuckDocument[]>([]);
  const [id, setId] = useState("");
  const [duckId, setDuckId] = useState("");
  const [level, setLevel] = useState("1");
  const [name, setName] = useState("");
  const [type, setType] = useState("duck");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function loadDucks() {
    const data = (await listDucks()) as DuckDocument[];
    setDucks(data);

    if (data.length > 0) {
      setDuckId(data[0].id);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setMessage("");

      await createDuckReward({
        id,
        duckId,
        level: Number(level),
        name,
        type: type as
          | "duck"
          | "duck_xp"
          | "island_item"
          | "accessory"
          | "border"
          | "pin"
          | "digital_art"
          | "ravelbox"
          | "skin",
        description,
      });

      setMessage("Recompensa criada com sucesso.");
      router.push("/admin/recompensas");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar recompensa.");
    }
  }

  useEffect(() => {
    loadDucks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Nova recompensa"
        description="Cadastre uma recompensa de nível para um pato."
      />

      <AdminFormCard>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <AdminInput
            label="ID da recompensa"
            value={id}
            onChange={setId}
            placeholder="Ex: reward-samurai-1"
            required
          />

          <AdminSelect
            label="Pato"
            value={duckId}
            onChange={setDuckId}
            options={ducks.map((duck) => ({
              label: duck.name,
              value: duck.id,
            }))}
            required
          />

          <AdminInput
            label="Nível"
            value={level}
            onChange={setLevel}
            type="number"
            required
          />

          <AdminInput
            label="Nome da recompensa"
            value={name}
            onChange={setName}
            placeholder="Ex: Borda Samurai"
            required
          />

          <AdminSelect
            label="Tipo"
            value={type}
            onChange={setType}
            options={[
              { label: "Pato", value: "duck" },
              { label: "XP", value: "duck_xp" },
              { label: "Item de ilha", value: "island_item" },
              { label: "Acessório", value: "accessory" },
              { label: "Borda", value: "border" },
              { label: "Pin", value: "pin" },
              { label: "Arte digital", value: "digital_art" },
              { label: "Ravelbox", value: "ravelbox" },
              { label: "Skin", value: "skin" },
            ]}
            required
          />

          <AdminTextarea
            label="Descrição"
            value={description}
            onChange={setDescription}
            placeholder="Descreva a recompensa."
            required
          />

          {message && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Criar recompensa
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
