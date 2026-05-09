# Etapa 1 — Tela de progressão do Pato Junkrat

Esta etapa cria a primeira tela real do projeto **Ravel Ducks**:

```txt
/patos/duck-junkrat
```

A tela representa a progressão do **Pato Junkrat**, com nível, XP e trilha de recompensas do nível 1 ao 10.

Nesta etapa ainda vamos usar **dados mockados**, sem Firebase.

---

## Objetivo da Etapa 1

Criar uma tela com:

```txt
Pato Junkrat
Raridade
Nível atual
Barra de XP
Recompensa atual
Trilha de recompensas
Status de cada nível
```

Os status serão:

```txt
desbloqueado
bloqueado
recompensa atual
```

---

## Observação importante sobre a estrutura do projeto

O seu projeto foi criado **sem a pasta `src`**.

Então, em vez de usar:

```txt
src/app
src/components
src/lib
src/types
```

Você deve usar:

```txt
app
components
lib
types
```

Sua estrutura final deve ficar assim:

```txt
ravel-ducks/
  app/
    page.tsx
    layout.tsx
    globals.css
    patos/
      [duckId]/
        page.tsx

  components/
    ducks/
      DuckProgressHeader.tsx
      DuckCurrentReward.tsx
      DuckRewardTrack.tsx
      DuckRewardCard.tsx

  lib/
    mock-data.ts

  types/
    duck.ts
```

---

## 1. Criar o projeto

No terminal, rode:

```bash
npx create-next-app@latest ravel-ducks
```

Escolha assim:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: No
Import alias: @/*
```

Depois:

```bash
cd ravel-ducks
npm run dev
```

Se abrir em:

```txt
http://localhost:3000
```

está tudo certo.

---

## 2. Criar a estrutura de pastas

Dentro de `ravel-ducks`, crie estas pastas:

```txt
components
lib
types
```

Dentro de `components`, crie:

```txt
ducks
```

Dentro de `app`, crie:

```txt
patos
```

Dentro de `patos`, crie:

```txt
[duckId]
```

E dentro de `[duckId]`, crie:

```txt
page.tsx
```

No final, deve ficar assim:

```txt
app/
  patos/
    [duckId]/
      page.tsx
```

---

## 3. Conferir o alias do TypeScript

Abra o arquivo:

```txt
tsconfig.json
```

Procure algo assim:

```json
"paths": {
  "@/*": ["./*"]
}
```

Se estiver assim, está correto.

Se estiver assim:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

mude para:

```json
"paths": {
  "@/*": ["./*"]
}
```

Como o projeto está sem `src`, o alias precisa apontar para a raiz do projeto.

---

## 4. Criar os tipos

Crie o arquivo:

```txt
types/duck.ts
```

Com este conteúdo:

```ts
export type DuckRarity = "common" | "rare" | "epic" | "legendary";

export type DuckRewardType =
  | "duck"
  | "border"
  | "pin"
  | "island_accessory"
  | "digital_art"
  | "ravelbox"
  | "skin";

export interface Duck {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: DuckRarity;
  level: number;
  xp: number;
  nextLevelXp: number;
  maxLevel: number;
  imageUrl: string;
}

export interface DuckReward {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: DuckRewardType;
  description: string;
  imageUrl?: string;
}
```

---

## 5. Criar os dados mockados

Crie o arquivo:

```txt
lib/mock-data.ts
```

Com este conteúdo:

```ts
import { Duck, DuckReward } from "@/types/duck";

export const mockDuck: Duck = {
  id: "duck-junkrat",
  name: "Pato Junkrat",
  slug: "pato-junkrat",
  theme: "Junkrat",
  rarity: "epic",
  level: 4,
  xp: 430,
  nextLevelXp: 500,
  maxLevel: 10,
  imageUrl: "/ducks/pato-junkrat.png",
};

export const junkratRewards: DuckReward[] = [
  {
    id: "reward-junkrat-1",
    duckId: "duck-junkrat",
    level: 1,
    name: "Pato Junkrat",
    type: "duck",
    description: "Desbloqueia o Pato Junkrat na sua coleção.",
  },
  {
    id: "reward-junkrat-2",
    duckId: "duck-junkrat",
    level: 2,
    name: "Borda temática Junkrat",
    type: "border",
    description: "Uma borda temática para destacar seu perfil.",
  },
  {
    id: "reward-junkrat-3",
    duckId: "duck-junkrat",
    level: 3,
    name: "Pin Junkrat",
    type: "pin",
    description: "Um pin colecionável do Pato Junkrat.",
  },
  {
    id: "reward-junkrat-4",
    duckId: "duck-junkrat",
    level: 4,
    name: "Acessório Junkrat na ilha",
    type: "island_accessory",
    description: "Um acessório temático para decorar sua ilha.",
  },
  {
    id: "reward-junkrat-5",
    duckId: "duck-junkrat",
    level: 5,
    name: "Arte digital HD",
    type: "digital_art",
    description: "Arte digital em alta definição do Pato Junkrat.",
  },
  {
    id: "reward-junkrat-6",
    duckId: "duck-junkrat",
    level: 6,
    name: "Ravelbox",
    type: "ravelbox",
    description: "Uma Ravelbox como recompensa especial.",
  },
  {
    id: "reward-junkrat-7",
    duckId: "duck-junkrat",
    level: 7,
    name: "Acessório lendário de ilha",
    type: "island_accessory",
    description: "Um item visual mais raro para a ilha.",
  },
  {
    id: "reward-junkrat-8",
    duckId: "duck-junkrat",
    level: 8,
    name: "Junkrat Rei",
    type: "skin",
    description: "Visual evoluído do Pato Junkrat.",
  },
  {
    id: "reward-junkrat-9",
    duckId: "duck-junkrat",
    level: 9,
    name: "Borda lendária",
    type: "border",
    description: "Uma borda lendária para o perfil.",
  },
  {
    id: "reward-junkrat-10",
    duckId: "duck-junkrat",
    level: 10,
    name: "Ravelbox",
    type: "ravelbox",
    description: "Recompensa final da trilha do Pato Junkrat.",
  },
];
```

---

## 6. Criar o componente do cabeçalho do pato

Crie o arquivo:

```txt
components/ducks/DuckProgressHeader.tsx
```

Código:

```tsx
import { Duck } from "@/types/duck";

interface DuckProgressHeaderProps {
  duck: Duck;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export function DuckProgressHeader({ duck }: DuckProgressHeaderProps) {
  const xpPercentage = Math.min((duck.xp / duck.nextLevelXp) * 100, 100);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-zinc-900 p-6">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-yellow-500/40 bg-zinc-900 text-center text-sm text-zinc-400">
            Imagem do pato
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold uppercase text-zinc-950">
              {rarityLabel[duck.rarity]}
            </span>

            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300">
              Tema: {duck.theme}
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white">
            {duck.name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Evolua este pato para desbloquear recompensas temáticas, itens de ilha,
            bordas, pins, artes digitais e Ravelbox.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-zinc-200">
                Nível {duck.level}/{duck.maxLevel}
              </span>

              <span className="text-zinc-400">
                {duck.xp}/{duck.nextLevelXp} XP
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 7. Criar o card de recompensa

Crie o arquivo:

```txt
components/ducks/DuckRewardCard.tsx
```

Código:

```tsx
import { DuckReward } from "@/types/duck";

interface DuckRewardCardProps {
  reward: DuckReward;
  currentLevel: number;
}

const rewardTypeLabel = {
  duck: "Pato",
  border: "Borda",
  pin: "Pin",
  island_accessory: "Ilha",
  digital_art: "Arte",
  ravelbox: "Ravelbox",
  skin: "Visual",
};

export function DuckRewardCard({ reward, currentLevel }: DuckRewardCardProps) {
  const isUnlocked = currentLevel >= reward.level;
  const isCurrent = currentLevel === reward.level;

  return (
    <article
      className={[
        "min-w-[150px] rounded-xl border p-4 transition",
        isCurrent
          ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-500/10"
          : isUnlocked
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-zinc-800 bg-zinc-900/80 opacity-70",
      ].join(" ")}
    >
      <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-zinc-800">
        <span className="text-2xl">
          {reward.type === "duck" && "🦆"}
          {reward.type === "border" && "🖼️"}
          {reward.type === "pin" && "📌"}
          {reward.type === "island_accessory" && "🏝️"}
          {reward.type === "digital_art" && "🎨"}
          {reward.type === "ravelbox" && "🎁"}
          {reward.type === "skin" && "👑"}
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold uppercase text-zinc-300">
          LV {reward.level}
        </span>

        <span className="text-[10px] uppercase text-zinc-500">
          {rewardTypeLabel[reward.type]}
        </span>
      </div>

      <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-white">
        {reward.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
        {reward.description}
      </p>

      <div className="mt-4">
        {isUnlocked ? (
          <button className="w-full rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-zinc-950">
            {isCurrent ? "Atual" : "Liberado"}
          </button>
        ) : (
          <button disabled className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-500">
            Bloqueado
          </button>
        )}
      </div>
    </article>
  );
}
```

---

## 8. Criar a trilha de recompensas

Crie o arquivo:

```txt
components/ducks/DuckRewardTrack.tsx
```

Código:

```tsx
import { DuckReward } from "@/types/duck";
import { DuckRewardCard } from "./DuckRewardCard";

interface DuckRewardTrackProps {
  rewards: DuckReward[];
  currentLevel: number;
}

export function DuckRewardTrack({
  rewards,
  currentLevel,
}: DuckRewardTrackProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            Trilha de recompensas
          </h2>
          <p className="text-sm text-zinc-400">
            Evolua o pato para desbloquear todos os níveis.
          </p>
        </div>

        <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300">
          {currentLevel}/10
        </span>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex gap-4">
          {rewards.map((reward) => (
            <DuckRewardCard
              key={reward.id}
              reward={reward}
              currentLevel={currentLevel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 9. Criar recompensa atual

Crie o arquivo:

```txt
components/ducks/DuckCurrentReward.tsx
```

Código:

```tsx
import { DuckReward } from "@/types/duck";

interface DuckCurrentRewardProps {
  reward?: DuckReward;
}

export function DuckCurrentReward({ reward }: DuckCurrentRewardProps) {
  if (!reward) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
        <h2 className="text-xl font-bold text-white">Trilha completa</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Todas as recompensas deste pato já foram desbloqueadas.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 p-6 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
        Recompensa atual
      </p>

      <div className="mt-4 grid gap-5 md:grid-cols-[120px_1fr_auto] md:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-900 text-4xl">
          {reward.type === "duck" && "🦆"}
          {reward.type === "border" && "🖼️"}
          {reward.type === "pin" && "📌"}
          {reward.type === "island_accessory" && "🏝️"}
          {reward.type === "digital_art" && "🎨"}
          {reward.type === "ravelbox" && "🎁"}
          {reward.type === "skin" && "👑"}
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            Nível {reward.level} - {reward.name}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            {reward.description}
          </p>
        </div>

        <button className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300">
          Equipar
        </button>
      </div>
    </section>
  );
}
```

---

## 10. Criar a página `/patos/[duckId]`

Crie o arquivo:

```txt
app/patos/[duckId]/page.tsx
```

Código:

```tsx
import { DuckCurrentReward } from "@/components/ducks/DuckCurrentReward";
import { DuckProgressHeader } from "@/components/ducks/DuckProgressHeader";
import { DuckRewardTrack } from "@/components/ducks/DuckRewardTrack";
import { junkratRewards, mockDuck } from "@/lib/mock-data";

interface DuckProgressPageProps {
  params: {
    duckId: string;
  };
}

export default function DuckProgressPage({ params }: DuckProgressPageProps) {
  const duck = mockDuck;

  const currentReward =
    junkratRewards.find((reward) => reward.level === duck.level) ??
    junkratRewards[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>
            <h1 className="mt-1 text-2xl font-black text-white">
              Proficiência do pato
            </h1>
          </div>

          <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
            ID: {params.duckId}
          </span>
        </div>

        <DuckProgressHeader duck={duck} />

        <DuckCurrentReward reward={currentReward} />

        <DuckRewardTrack
          rewards={junkratRewards}
          currentLevel={duck.level}
        />
      </div>
    </main>
  );
}
```

---

## 11. Ajustar a página inicial

Abra:

```txt
app/page.tsx
```

Substitua por:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Plataforma de patinhos colecionáveis
        </h1>

        <p className="mt-4 text-zinc-400">
          Abra pacotes, colecione patos, evolua personagens e personalize sua ilha.
        </p>

        <Link
          href="/patos/duck-junkrat"
          className="mt-8 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
        >
          Ver Pato Junkrat
        </Link>
      </section>
    </main>
  );
}
```

---

## 12. Rodar o projeto

No terminal:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

Depois clique em **Ver Pato Junkrat** ou acesse direto:

```txt
http://localhost:3000/patos/duck-junkrat
```

---

## 13. O que essa etapa entrega

Ao final da Etapa 1, você terá:

```txt
Tela visual de progressão do pato
Trilha de níveis 1 a 10
Recompensas do Pato Junkrat
XP atual
Nível atual
Estados bloqueado/liberado
Base de componentes reutilizáveis
```

Essa tela já dá para mostrar ao Ravel e dizer:

> “Aqui é a base da progressão dos patos. Cada pato vai ter sua própria trilha, igual essa do Junkrat.”

---

## 14. Próxima melhoria dentro da Etapa 1

Depois de rodar essa base, a próxima melhoria seria criar uma versão mais bonita e mais próxima da imagem de referência, com:

```txt
card grande do pato à esquerda
recompensa central
trilha horizontal embaixo
abas: Recompensas / Missões
missões para ganhar XP
```

Mas primeiro rode essa base.

Quando aparecer algum erro, envie o print ou o arquivo que deu problema.
