# Etapa 14 — Formulários reais de criação no Admin

Nesta etapa vamos transformar o painel admin em uma ferramenta de cadastro real.

Na Etapa 13, o admin passou a ler dados reais do Firestore em:

```txt
/admin
/admin/patos
/admin/cartas
/admin/pacotes
/admin/ravelboxes
/admin/liberar-pacote
```

Agora vamos implementar os formulários para o Ravel conseguir criar dados diretamente pelo painel, sem depender apenas das páginas de seed.

---

## 1. Objetivo da etapa

Criar formulários reais para:

- cadastrar pato;
- cadastrar carta;
- cadastrar pacote;
- criar trilha de recompensas de um pato;
- selecionar cartas que entram no pacote;
- desativar registros;
- atualizar as listas depois do cadastro.

Nesta etapa, o foco é **criação real no Firestore**.

Edição detalhada e exclusão completa podem ficar para uma etapa futura.

---

## 2. Telas que serão criadas ou atualizadas

Vamos trabalhar com:

```txt
/admin/patos
/admin/patos/novo

/admin/cartas
/admin/cartas/nova

/admin/pacotes
/admin/pacotes/novo

/admin/recompensas
/admin/recompensas/nova
```

Também vamos ajustar os botões:

```txt
Novo pato
Nova carta
Novo pacote
Nova recompensa
```

Para levarem às páginas reais de cadastro.

---

## 3. Coleções envolvidas

Usaremos:

```txt
ducks
cards
packs
duckRewards
```

### `ducks`

Patos base do sistema.

### `cards`

Cartas que podem sair nos pacotes.

### `packs`

Pacotes que agrupam cartas.

### `duckRewards`

Trilhas de recompensa por nível de cada pato.

---

## 4. Estrutura de arquivos

Crie ou atualize:

```txt
app/
  admin/
    patos/
      page.tsx
      novo/
        page.tsx
    cartas/
      page.tsx
      nova/
        page.tsx
    pacotes/
      page.tsx
      novo/
        page.tsx
    recompensas/
      page.tsx
      nova/
        page.tsx

services/
  ducks-service.ts
  cards-service.ts
  packs-service.ts
  duck-rewards-service.ts

components/
  admin/
    AdminFormCard.tsx
    AdminInput.tsx
    AdminSelect.tsx
    AdminTextarea.tsx
    AdminCheckboxList.tsx
```

---

## 5. Criar componente `AdminFormCard`

Crie:

```txt
components/admin/AdminFormCard.tsx
```

Com o conteúdo:

```tsx
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
```

---

## 6. Criar componente `AdminInput`

Crie:

```txt
components/admin/AdminInput.tsx
```

Com o conteúdo:

```tsx
interface AdminInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
  required?: boolean;
}

export function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: AdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}
```

---

## 7. Criar componente `AdminTextarea`

Crie:

```txt
components/admin/AdminTextarea.tsx
```

Com o conteúdo:

```tsx
interface AdminTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
}: AdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}
```

---

## 8. Criar componente `AdminSelect`

Crie:

```txt
components/admin/AdminSelect.tsx
```

Com o conteúdo:

```tsx
interface AdminSelectOption {
  label: string;
  value: string;
}

interface AdminSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  required?: boolean;
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  required,
}: AdminSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## 9. Criar componente `AdminCheckboxList`

Crie:

```txt
components/admin/AdminCheckboxList.tsx
```

Com o conteúdo:

```tsx
interface AdminCheckboxOption {
  label: string;
  value: string;
  helper?: string;
}

interface AdminCheckboxListProps {
  label: string;
  options: AdminCheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function AdminCheckboxList({
  label,
  options,
  selectedValues,
  onChange,
}: AdminCheckboxListProps) {
  function toggleValue(value: string) {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-zinc-300">{label}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const checked = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                checked
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(option.value)}
                className="mt-1"
              />

              <span>
                <span className="block text-sm font-bold text-white">
                  {option.label}
                </span>

                {option.helper && (
                  <span className="mt-1 block text-xs text-zinc-500">
                    {option.helper}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 10. Atualizar `ducks-service.ts`

Abra:

```txt
services/ducks-service.ts
```

Confirme se já existe:

```ts
createDuck
listDucks
getDuckById
```

Agora adicione a função para desativar pato:

```ts
import { updateDoc } from "firebase/firestore";
```

Se o import já existir, apenas inclua `updateDoc`.

Adicione:

```ts
export async function updateDuckActiveStatus(duckId: string, active: boolean) {
  const duckRef = doc(db, "ducks", duckId);

  await updateDoc(duckRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
```

---

## 11. Atualizar `cards-service.ts`

Abra:

```txt
services/cards-service.ts
```

Confirme se já existe:

```ts
createCard
listActiveCards
getCardById
getCardsByIds
```

Agora adicione:

```ts
import { updateDoc } from "firebase/firestore";
```

Se o import já existir, apenas inclua.

Adicione:

```ts
export async function listCards() {
  const cardsRef = collection(db, "cards");
  const snapshot = await getDocs(cardsRef);

  return snapshot.docs.map((cardDocument) => {
    const data = cardDocument.data();

    return {
      ...data,
      id: cardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as CardDocument;
  });
}

export async function updateCardActiveStatus(cardId: string, active: boolean) {
  const cardRef = doc(db, "cards", cardId);

  await updateDoc(cardRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
```

---

## 12. Atualizar `packs-service.ts`

Abra:

```txt
services/packs-service.ts
```

Confirme se já existe:

```ts
createPack
getPackById
listActivePacks
```

Agora adicione:

```ts
import { updateDoc } from "firebase/firestore";
```

Se o import já existir, apenas inclua.

Adicione:

```ts
export async function listPacks() {
  const packsRef = collection(db, "packs");
  const snapshot = await getDocs(packsRef);

  return snapshot.docs.map((packDocument) => {
    const data = packDocument.data();

    return {
      ...data,
      id: packDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as PackDocument;
  });
}

export async function updatePackActiveStatus(packId: string, active: boolean) {
  const packRef = doc(db, "packs", packId);

  await updateDoc(packRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
```

---

## 13. Criar página `/admin/patos/novo`

Crie:

```txt
app/admin/patos/novo/page.tsx
```

Com o conteúdo:

```tsx
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
  const [message, setMessage] = useState("");

  function generateIdFromSlug(value: string) {
    return value.startsWith("duck-") ? value : `duck-${value}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
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
      });

      setMessage("Pato criado com sucesso.");

      router.push("/admin/patos");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar pato.");
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
            placeholder="Ex: Pato Samurai"
            required
          />

          <AdminInput
            label="Slug"
            value={slug}
            onChange={setSlug}
            placeholder="Ex: pato-samurai"
            required
          />

          <AdminInput
            label="Tema"
            value={theme}
            onChange={setTheme}
            placeholder="Ex: Samurai"
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

          {message && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Criar pato
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
```

---

## 14. Ajustar botão em `/admin/patos`

Na página:

```txt
app/admin/patos/page.tsx
```

Se `AdminSectionHeader` ainda usa `actionLabel`, ele provavelmente não navega.

Troque por algo simples no header da página ou atualize o componente para aceitar `actionHref`.

### Opção recomendada: atualizar `AdminSectionHeader`

Abra:

```txt
components/admin/AdminSectionHeader.tsx
```

Atualize para:

```tsx
import Link from "next/link";

interface AdminSectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function AdminSectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Painel Admin
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">{title}</h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">{description}</p>
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-xl bg-yellow-400 px-5 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          {actionLabel}
        </Link>
      )}
    </header>
  );
}
```

Depois, em `/admin/patos`, use:

```tsx
<AdminSectionHeader
  title="Patos"
  description="Gerencie os patinhos colecionáveis cadastrados no Firestore."
  actionLabel="Novo pato"
  actionHref="/admin/patos/novo"
/>
```

---

## 15. Criar página `/admin/cartas/nova`

Crie:

```txt
app/admin/cartas/nova/page.tsx
```

Com o conteúdo:

```tsx
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
  const [message, setMessage] = useState("");

  async function loadDucks() {
    const data = await listDucks();
    setDucks(data as DuckDocument[]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
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
      });

      setMessage("Carta criada com sucesso.");
      router.push("/admin/cartas");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar carta.");
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
            placeholder="Ex: card-duck-samurai"
            required
          />

          <AdminInput
            label="Nome"
            value={name}
            onChange={setName}
            placeholder="Ex: Pato Samurai"
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

          {message && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Criar carta
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
```

Depois, em `/admin/cartas`, use:

```tsx
<AdminSectionHeader
  title="Cartas"
  description="Cartas reais cadastradas no Firestore e disponíveis para pacotes."
  actionLabel="Nova carta"
  actionHref="/admin/cartas/nova"
/>
```

---

## 16. Criar página `/admin/pacotes/novo`

Crie:

```txt
app/admin/pacotes/novo/page.tsx
```

Com o conteúdo:

```tsx
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
  const [message, setMessage] = useState("");

  async function loadCards() {
    const data = await listActiveCards();
    setCards(data);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
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
      });

      setMessage("Pacote criado com sucesso.");
      router.push("/admin/pacotes");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar pacote.");
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
            placeholder="Ex: pack-samurai"
            required
          />

          <AdminInput
            label="Nome"
            value={name}
            onChange={setName}
            placeholder="Ex: Pacote Samurai"
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
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Criar pacote
          </button>
        </form>
      </AdminFormCard>
    </AdminLayout>
  );
}
```

Depois, em `/admin/pacotes`, use:

```tsx
<AdminSectionHeader
  title="Pacotes"
  description="Modelos de pacotes reais cadastrados no Firestore."
  actionLabel="Novo pacote"
  actionHref="/admin/pacotes/novo"
/>
```

---

## 17. Criar página `/admin/recompensas`

Crie:

```txt
app/admin/recompensas/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { listDucks } from "@/services/ducks-service";
import { listRewardsByDuckId } from "@/services/duck-rewards-service";
import { DuckDocument, DuckRewardDocument } from "@/types/database";

interface RewardWithDuck {
  reward: DuckRewardDocument;
  duck: DuckDocument | null;
}

export default function AdminRewardsPage() {
  const [items, setItems] = useState<RewardWithDuck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRewards() {
    try {
      setIsLoading(true);

      const ducks = (await listDucks()) as DuckDocument[];

      const rewardsByDuck = await Promise.all(
        ducks.map(async (duck) => {
          const rewards = await listRewardsByDuckId(duck.id);

          return rewards.map((reward) => ({
            reward,
            duck,
          }));
        })
      );

      setItems(rewardsByDuck.flat());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRewards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Recompensas"
        description="Trilhas de recompensa cadastradas para os patos."
        actionLabel="Nova recompensa"
        actionHref="/admin/recompensas/nova"
      />

      <AdminDataTable headers={["Pato", "Nível", "Recompensa", "Tipo"]}>
        {isLoading && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando recompensas...
            </td>
          </tr>
        )}

        {!isLoading && items.length === 0 && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma recompensa cadastrada.
            </td>
          </tr>
        )}

        {!isLoading &&
          items.map(({ reward, duck }) => (
            <tr key={reward.id}>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {duck?.name ?? reward.duckId}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.level}
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">{reward.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {reward.description}
                </p>
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.type}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 18. Criar página `/admin/recompensas/nova`

Crie:

```txt
app/admin/recompensas/nova/page.tsx
```

Com o conteúdo:

```tsx
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
```

---

## 19. Atualizar menu admin

Abra:

```txt
components/admin/AdminSidebar.tsx
```

Adicione:

```ts
{
  href: "/admin/recompensas",
  label: "Recompensas",
},
```

Sugestão de ordem:

```ts
const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/patos", label: "Patos" },
  { href: "/admin/cartas", label: "Cartas" },
  { href: "/admin/pacotes", label: "Pacotes" },
  { href: "/admin/recompensas", label: "Recompensas" },
  { href: "/admin/liberar-pacote", label: "Liberar pacote" },
  { href: "/admin/ravelboxes", label: "Ravelboxes" },
  { href: "/admin/live-events", label: "Eventos da live" },
  { href: "/admin/live-events-test", label: "Teste de eventos" },
];
```

---

## 20. Atualizar regras do Firestore

As regras da Etapa 13 já devem permitir admin escrever em:

```txt
ducks
cards
packs
duckRewards
```

Confirme:

```txt
match /ducks/{duckId} {
  allow read: if true;
  allow write: if isAdmin();
}

match /duckRewards/{rewardId} {
  allow read: if true;
  allow write: if isAdmin();
}

match /cards/{cardId} {
  allow read: if isSignedIn();
  allow write: if isAdmin();
}

match /packs/{packId} {
  allow read: if isSignedIn();
  allow write: if isAdmin();
}
```

---

## 21. Fluxo de teste

### 1. Login como admin

Acesse:

```txt
/login
```

Entre com uma conta que tenha:

```txt
role: "admin"
```

### 2. Criar pato

Acesse:

```txt
/admin/patos/novo
```

Crie:

```txt
Nome: Pato Samurai
Slug: pato-samurai
Tema: Samurai
Raridade: Épico
Nível máximo: 10
```

Depois confira:

```txt
/admin/patos
```

### 3. Criar carta

Acesse:

```txt
/admin/cartas/nova
```

Crie uma carta relacionada ao Pato Samurai.

Exemplo:

```txt
ID: card-duck-samurai
Nome: Pato Samurai
Tipo: Pato
Raridade: Épico
Pato relacionado: Pato Samurai
```

Depois confira:

```txt
/admin/cartas
```

### 4. Criar recompensa

Acesse:

```txt
/admin/recompensas/nova
```

Crie:

```txt
ID: reward-samurai-1
Pato: Pato Samurai
Nível: 1
Nome: Pato Samurai
Tipo: Pato
Descrição: Desbloqueia o Pato Samurai.
```

Depois confira:

```txt
/admin/recompensas
```

### 5. Criar pacote

Acesse:

```txt
/admin/pacotes/novo
```

Crie:

```txt
ID: pack-samurai
Nome: Pacote Samurai
Quantidade: 4
Cartas do pacote: selecione card-duck-samurai e outras cartas
```

Depois confira:

```txt
/admin/pacotes
```

### 6. Liberar pacote

Acesse:

```txt
/admin/liberar-pacote
```

Libere o novo pacote para seu usuário.

### 7. Abrir pacote

Acesse:

```txt
/pacotes
```

Abra o pacote e veja se as cartas entram no fluxo.

---

## 22. Problemas comuns

### Botão "Novo pato" não funciona

Verifique se `AdminSectionHeader` foi atualizado com `actionHref`.

### Select de pato vazio ao criar carta

Verifique se existem patos em `ducks`.

### Select de cartas vazio ao criar pacote

Verifique se existem cartas ativas em `cards`.

### Erro de permissão

Verifique se:

```txt
sua conta tem role admin
as regras foram publicadas
você está logado
```

### Documento criado, mas não aparece na listagem

Verifique se o campo:

```txt
active: true
```

foi criado corretamente.

---

## 23. O que essa etapa entrega

Ao final da Etapa 14, você terá:

```txt
formulário real para criar pato
formulário real para criar carta
formulário real para criar pacote
formulário real para criar recompensa de pato
seleção de cartas para o pacote
seleção de pato relacionado para cartas e recompensas
menos dependência das páginas de seed
painel admin mais próximo de produção
```

---

## 24. Limitações desta etapa

Ainda não teremos:

```txt
edição de registros existentes
exclusão/desativação pela tabela
upload de imagem dos patos/cartas
controle de probabilidade por carta
validação avançada de ID duplicado
formulário em etapas para trilha completa de 1 a 10
```

---

## 25. Próxima etapa

A próxima etapa recomendada será:

```txt
Etapa 15 — Probabilidade e raridade no sorteio de cartas
```

Nela vamos ajustar o sistema para:

```txt
cartas comuns saírem mais
cartas raras saírem menos
cartas épicas/lendárias terem menor chance
pacotes terem regras de drop
possível garantia de uma carta rara por pacote
controle admin das chances
```
