# Etapa 4 — Coleção do usuário

Nesta etapa vamos criar a página:

```txt
/colecao
```

Essa página será responsável por mostrar todos os patinhos que o usuário possui, com nível, XP, raridade e progresso de recompensas.

Ela conecta diretamente com a Etapa 1, porque cada pato da coleção terá um botão para acessar a tela de progressão individual:

```txt
/patos/[duckId]
```

---

## 1. Objetivo da etapa

Criar uma tela de coleção onde o usuário consiga visualizar:

- todos os patos desbloqueados;
- nome de cada pato;
- raridade;
- nível atual;
- XP atual;
- progresso até o próximo nível;
- quantidade de recompensas liberadas;
- botão para ver a trilha de progressão;
- estatísticas gerais da coleção.

Nesta etapa ainda vamos usar **dados mockados**, sem Firebase.

---

## 2. Estrutura de pastas

Como seu projeto está **sem pasta `src`**, vamos criar tudo diretamente na raiz.

Estrutura desta etapa:

```txt
ravel-ducks/
  app/
    colecao/
      page.tsx

  components/
    collection/
      CollectionStats.tsx
      DuckCollectionCard.tsx
      DuckCollectionGrid.tsx

  lib/
    collection-mock-data.ts

  types/
    collection.ts
```

---

## 3. Criar os tipos da coleção

Crie o arquivo:

```txt
types/collection.ts
```

Com o conteúdo:

```ts
export type CollectionDuckRarity = "common" | "rare" | "epic" | "legendary";

export interface CollectionDuck {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: CollectionDuckRarity;
  level: number;
  maxLevel: number;
  xp: number;
  nextLevelXp: number;
  unlockedRewards: number;
  totalRewards: number;
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface CollectionStats {
  totalDucks: number;
  totalLegendaryDucks: number;
  totalEpicDucks: number;
  totalRewardsUnlocked: number;
  totalRavelboxes: number;
}
```

---

## 4. Criar os dados mockados da coleção

Crie o arquivo:

```txt
lib/collection-mock-data.ts
```

Com o conteúdo:

```ts
import { CollectionDuck, CollectionStats } from "@/types/collection";

export const mockCollectionDucks: CollectionDuck[] = [
  {
    id: "duck-junkrat",
    name: "Pato Junkrat",
    slug: "duck-junkrat",
    theme: "Junkrat",
    rarity: "epic",
    level: 4,
    maxLevel: 10,
    xp: 430,
    nextLevelXp: 500,
    unlockedRewards: 4,
    totalRewards: 10,
    isFavorite: true,
  },
  {
    id: "duck-king",
    name: "Pato Rei",
    slug: "duck-king",
    theme: "Realeza",
    rarity: "legendary",
    level: 2,
    maxLevel: 10,
    xp: 120,
    nextLevelXp: 250,
    unlockedRewards: 2,
    totalRewards: 10,
  },
  {
    id: "duck-basic",
    name: "Pato Clássico",
    slug: "duck-basic",
    theme: "Inicial",
    rarity: "common",
    level: 1,
    maxLevel: 10,
    xp: 40,
    nextLevelXp: 100,
    unlockedRewards: 1,
    totalRewards: 10,
  },
  {
    id: "duck-shadow",
    name: "Pato Sombra",
    slug: "duck-shadow",
    theme: "Noturno",
    rarity: "legendary",
    level: 6,
    maxLevel: 10,
    xp: 980,
    nextLevelXp: 1200,
    unlockedRewards: 6,
    totalRewards: 10,
  },
  {
    id: "duck-ninja",
    name: "Pato Ninja",
    slug: "duck-ninja",
    theme: "Shinobi",
    rarity: "rare",
    level: 3,
    maxLevel: 10,
    xp: 210,
    nextLevelXp: 300,
    unlockedRewards: 3,
    totalRewards: 10,
  },
  {
    id: "duck-mage",
    name: "Pato Mago",
    slug: "duck-mage",
    theme: "Arcano",
    rarity: "epic",
    level: 5,
    maxLevel: 10,
    xp: 740,
    nextLevelXp: 800,
    unlockedRewards: 5,
    totalRewards: 10,
  },
];

export const mockCollectionStats: CollectionStats = {
  totalDucks: mockCollectionDucks.length,
  totalLegendaryDucks: mockCollectionDucks.filter(
    (duck) => duck.rarity === "legendary"
  ).length,
  totalEpicDucks: mockCollectionDucks.filter((duck) => duck.rarity === "epic")
    .length,
  totalRewardsUnlocked: mockCollectionDucks.reduce(
    (acc, duck) => acc + duck.unlockedRewards,
    0
  ),
  totalRavelboxes: 4,
};
```

---

## 5. Criar o componente `CollectionStats`

Crie o arquivo:

```txt
components/collection/CollectionStats.tsx
```

Com o conteúdo:

```tsx
import { CollectionStats as CollectionStatsType } from "@/types/collection";

interface CollectionStatsProps {
  stats: CollectionStatsType;
}

export function CollectionStats({ stats }: CollectionStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Patos
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Lendários
        </p>
        <p className="mt-2 text-3xl font-black text-yellow-400">
          {stats.totalLegendaryDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Épicos
        </p>
        <p className="mt-2 text-3xl font-black text-purple-400">
          {stats.totalEpicDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Recompensas
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRewardsUnlocked}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Ravelbox
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRavelboxes}
        </p>
      </div>
    </section>
  );
}
```

---

## 6. Criar o componente `DuckCollectionCard`

Crie o arquivo:

```txt
components/collection/DuckCollectionCard.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";
import { CollectionDuck } from "@/types/collection";

interface DuckCollectionCardProps {
  duck: CollectionDuck;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const rarityBadge = {
  common: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  rare: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  epic: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  legendary: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

const rarityGlow = {
  common: "hover:border-zinc-400/60",
  rare: "hover:border-sky-400/60 hover:shadow-sky-500/10",
  epic: "hover:border-purple-400/60 hover:shadow-purple-500/10",
  legendary: "hover:border-yellow-400/60 hover:shadow-yellow-500/10",
};

export function DuckCollectionCard({ duck }: DuckCollectionCardProps) {
  const xpPercentage = Math.min((duck.xp / duck.nextLevelXp) * 100, 100);
  const rewardsPercentage = Math.min(
    (duck.unlockedRewards / duck.totalRewards) * 100,
    100
  );

  return (
    <article
      className={[
        "overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1",
        rarityGlow[duck.rarity],
      ].join(" ")}
    >
      <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        {duck.isFavorite && (
          <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-zinc-950">
            Favorito
          </div>
        )}

        <div
          className={[
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold uppercase",
            rarityBadge[duck.rarity],
          ].join(" ")}
        >
          {rarityLabel[duck.rarity]}
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-6xl shadow-xl">
          🦆
        </div>
      </div>

      <div className="p-5">
        <div>
          <h2 className="text-xl font-black text-white">{duck.name}</h2>
          <p className="text-sm text-zinc-500">Tema: {duck.theme}</p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200">
              Nível {duck.level}/{duck.maxLevel}
            </span>
            <span className="text-zinc-500">
              {duck.xp}/{duck.nextLevelXp} XP
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200">Recompensas</span>
            <span className="text-zinc-500">
              {duck.unlockedRewards}/{duck.totalRewards}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${rewardsPercentage}%` }}
            />
          </div>
        </div>

        <Link
          href={`/patos/${duck.id}`}
          className="mt-6 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Ver progresso
        </Link>
      </div>
    </article>
  );
}
```

---

## 7. Criar o componente `DuckCollectionGrid`

Crie o arquivo:

```txt
components/collection/DuckCollectionGrid.tsx
```

Com o conteúdo:

```tsx
import { CollectionDuck } from "@/types/collection";
import { DuckCollectionCard } from "./DuckCollectionCard";

interface DuckCollectionGridProps {
  ducks: CollectionDuck[];
}

export function DuckCollectionGrid({ ducks }: DuckCollectionGridProps) {
  if (ducks.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
        <h2 className="text-2xl font-black text-white">
          Nenhum pato desbloqueado
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Abra pacotes durante a live para começar sua coleção.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {ducks.map((duck) => (
        <DuckCollectionCard key={duck.id} duck={duck} />
      ))}
    </section>
  );
}
```

---

## 8. Criar a página `/colecao`

Crie o arquivo:

```txt
app/colecao/page.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";
import { CollectionStats } from "@/components/collection/CollectionStats";
import { DuckCollectionGrid } from "@/components/collection/DuckCollectionGrid";
import {
  mockCollectionDucks,
  mockCollectionStats,
} from "@/lib/collection-mock-data";

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Minha coleção
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Veja todos os patinhos que você desbloqueou, acompanhe o nível,
              XP e as recompensas liberadas em cada trilha de progressão.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/ilhas"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Galeria
            </Link>

            <Link
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver minha ilha
            </Link>
          </div>
        </header>

        <CollectionStats stats={mockCollectionStats} />

        <DuckCollectionGrid ducks={mockCollectionDucks} />
      </div>
    </main>
  );
}
```

---

## 9. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Adicione um link para `/colecao`.

Você pode substituir o conteúdo atual por este:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Plataforma de patinhos colecionáveis
        </h1>

        <p className="mt-4 text-zinc-400">
          Abra pacotes, colecione patos, evolua personagens e personalize sua
          ilha pública para a comunidade da live.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Pato Junkrat
          </Link>

          <Link
            href="/ilha/ravel"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Ilha do Ravel
          </Link>

          <Link
            href="/ilhas"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Galeria
          </Link>

          <Link
            href="/colecao"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Minha coleção
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## 10. Rodar o projeto

No terminal, dentro da pasta correta:

```txt
D:\ProjetoRavel\ravel-ducks
```

Execute:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000/colecao
```

---

## 11. Testar os links

Na página `/colecao`, clique em:

```txt
Ver progresso
```

O card do Pato Junkrat deve levar para:

```txt
/patos/duck-junkrat
```

Os outros patos também vão tentar abrir rotas como:

```txt
/patos/duck-king
/patos/duck-shadow
/patos/duck-ninja
```

Como a Etapa 1 ainda usa o mesmo mock do Pato Junkrat para qualquer `duckId`, a página pode abrir mostrando o Pato Junkrat mesmo quando o ID for outro.

Isso será corrigido em uma etapa futura, quando criarmos dados reais por pato.

---

## 12. O que essa etapa entrega

Ao final da Etapa 4, você terá:

```txt
Página /colecao
Lista de patos desbloqueados
Card individual para cada pato
Nível e XP por pato
Raridade por pato
Progresso de recompensas
Estatísticas gerais da coleção
Integração visual com /patos/[duckId]
```

---

## 13. Limitações desta etapa

Nesta etapa ainda temos:

- dados mockados;
- sem autenticação;
- sem Firebase;
- sem filtro;
- sem busca;
- sem salvar progresso real;
- tela `/patos/[duckId]` ainda mostrando o mesmo pato mockado.

Essas limitações são esperadas nesta fase.

---

## 14. Melhorias futuras para a coleção

Depois podemos evoluir essa tela com:

- filtro por raridade;
- busca por nome do pato;
- ordenação por nível;
- ordenação por raridade;
- status de favorito;
- cards bloqueados para patos ainda não obtidos;
- integração com inventário real;
- atualização automática após abertura de pacote;
- imagens reais dos patos;
- conexão com Firebase.

---

## 15. Próxima etapa

Depois da Coleção do Usuário, a próxima etapa será:

```txt
Etapa 5 — Pacotes sem pagamento
```

Rota:

```txt
/pacotes
```

Nessa etapa vamos criar a tela onde o usuário vê os pacotes liberados pelo Ravel e pode abrir pacotes com 3 ou 4 cartas.

O sistema ainda será mockado, mas já vai simular:

```txt
pacote disponível
abrir pacote
revelar cartas
pato novo desbloqueado
duplicata virando XP
```
