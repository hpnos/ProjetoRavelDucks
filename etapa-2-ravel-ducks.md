# Etapa 2 — Ilha pública do usuário

Nesta etapa vamos criar a primeira versão da **ilha pública** do projeto Ravel Ducks.

A ideia é permitir que cada usuário tenha uma página pública com sua ilha, seus patinhos visíveis e alguns itens decorativos desbloqueados.

Nesta etapa ainda vamos usar **dados mockados**, sem Firebase e sem painel admin.

---

## 1. Objetivo da etapa

Criar a rota:

```txt
/ilha/[username]
```

Exemplo:

```txt
/ilha/ravel
```

Essa página deve mostrar:

- nome do usuário;
- avatar ou card do perfil;
- fundo da ilha;
- patos visíveis na ilha;
- acessórios/objetos decorativos;
- estatísticas da coleção;
- botão/link para voltar ou ver coleção.

A ilha será montada com **slots fixos**, não com drag and drop.

Isso facilita bastante a implementação inicial.

---

## 2. Estrutura de pastas

Como seu projeto está **sem pasta `src`**, a estrutura será criada diretamente na raiz:

```txt
ravel-ducks/
  app/
    ilha/
      [username]/
        page.tsx

  components/
    island/
      IslandPreview.tsx
      IslandDuck.tsx
      IslandItem.tsx
      IslandProfileCard.tsx
      IslandStatsCard.tsx

  types/
    island.ts

  lib/
    island-mock-data.ts
```

---

## 3. Criar os tipos da ilha

Crie o arquivo:

```txt
types/island.ts
```

Com o conteúdo:

```ts
export type IslandItemType =
  | "duck"
  | "decoration"
  | "accessory"
  | "background"
  | "special";

export type IslandSlot =
  | "main_duck"
  | "secondary_duck"
  | "left_decoration"
  | "right_decoration"
  | "center_decoration"
  | "special_item";

export interface IslandDuck {
  id: string;
  name: string;
  level: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl?: string;
  position: {
    left: string;
    top: string;
  };
}

export interface IslandItem {
  id: string;
  name: string;
  type: IslandItemType;
  slot: IslandSlot;
  imageUrl?: string;
  position: {
    left: string;
    top: string;
  };
}

export interface IslandOwner {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  title: string;
}

export interface UserIsland {
  id: string;
  owner: IslandOwner;
  backgroundName: string;
  backgroundUrl?: string;
  collectionStats: {
    totalDucks: number;
    totalRewards: number;
    rarestDuck: string;
    ravelboxesUnlocked: number;
  };
  ducks: IslandDuck[];
  items: IslandItem[];
}
```

---

## 4. Criar os dados mockados da ilha

Crie o arquivo:

```txt
lib/island-mock-data.ts
```

Com o conteúdo:

```ts
import { UserIsland } from "@/types/island";

export const mockIsland: UserIsland = {
  id: "island-ravel",
  owner: {
    id: "user-ravel",
    username: "ravel",
    displayName: "Ravel",
    title: "Colecionador de Patos",
  },
  backgroundName: "Ilha da Floresta",
  collectionStats: {
    totalDucks: 7,
    totalRewards: 18,
    rarestDuck: "Pato Junkrat",
    ravelboxesUnlocked: 2,
  },
  ducks: [
    {
      id: "duck-junkrat",
      name: "Pato Junkrat",
      level: 4,
      rarity: "epic",
      position: {
        left: "42%",
        top: "55%",
      },
    },
    {
      id: "duck-king",
      name: "Pato Rei",
      level: 2,
      rarity: "legendary",
      position: {
        left: "62%",
        top: "58%",
      },
    },
    {
      id: "duck-basic",
      name: "Pato Clássico",
      level: 1,
      rarity: "common",
      position: {
        left: "27%",
        top: "62%",
      },
    },
  ],
  items: [
    {
      id: "item-junkrat-barrel",
      name: "Barril Explosivo",
      type: "decoration",
      slot: "left_decoration",
      position: {
        left: "18%",
        top: "66%",
      },
    },
    {
      id: "item-junkrat-flag",
      name: "Bandeira Junkrat",
      type: "special",
      slot: "special_item",
      position: {
        left: "72%",
        top: "38%",
      },
    },
    {
      id: "item-tree",
      name: "Árvore da Ilha",
      type: "decoration",
      slot: "right_decoration",
      position: {
        left: "78%",
        top: "58%",
      },
    },
  ],
};
```

---

## 5. Criar o componente `IslandDuck`

Crie o arquivo:

```txt
components/island/IslandDuck.tsx
```

Com o conteúdo:

```tsx
import { IslandDuck as IslandDuckType } from "@/types/island";

interface IslandDuckProps {
  duck: IslandDuckType;
}

const rarityBorder = {
  common: "border-zinc-400",
  rare: "border-sky-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

const rarityGlow = {
  common: "shadow-zinc-500/20",
  rare: "shadow-sky-500/30",
  epic: "shadow-purple-500/30",
  legendary: "shadow-yellow-500/40",
};

export function IslandDuck({ duck }: IslandDuckProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: duck.position.left,
        top: duck.position.top,
      }}
    >
      <div
        className={[
          "group relative flex h-20 w-20 items-center justify-center rounded-full border-2 bg-zinc-950/80 shadow-xl backdrop-blur",
          rarityBorder[duck.rarity],
          rarityGlow[duck.rarity],
        ].join(" ")}
      >
        <span className="animate-bounce text-4xl">🦆</span>

        <div className="absolute -bottom-9 left-1/2 hidden min-w-[120px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-center shadow-xl group-hover:block">
          <p className="text-xs font-bold text-white">{duck.name}</p>
          <p className="text-[11px] text-zinc-400">Nível {duck.level}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Criar o componente `IslandItem`

Crie o arquivo:

```txt
components/island/IslandItem.tsx
```

Com o conteúdo:

```tsx
import { IslandItem as IslandItemType } from "@/types/island";

interface IslandItemProps {
  item: IslandItemType;
}

const itemIcon = {
  duck: "🦆",
  decoration: "🌴",
  accessory: "🎩",
  background: "🏝️",
  special: "🚩",
};

export function IslandItem({ item }: IslandItemProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: item.position.left,
        top: item.position.top,
      }}
    >
      <div className="group relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950/70 shadow-xl backdrop-blur">
        <span className="text-3xl">{itemIcon[item.type]}</span>

        <div className="absolute -bottom-8 left-1/2 hidden min-w-[120px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-center shadow-xl group-hover:block">
          <p className="text-xs font-bold text-white">{item.name}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Criar o componente `IslandProfileCard`

Crie o arquivo:

```txt
components/island/IslandProfileCard.tsx
```

Com o conteúdo:

```tsx
import { IslandOwner } from "@/types/island";

interface IslandProfileCardProps {
  owner: IslandOwner;
  backgroundName: string;
}

export function IslandProfileCard({
  owner,
  backgroundName,
}: IslandProfileCardProps) {
  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-3xl">
          🦆
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">{owner.displayName}</h2>
          <p className="text-sm text-zinc-400">@{owner.username}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Título
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{owner.title}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Ilha
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {backgroundName}
          </p>
        </div>
      </div>
    </aside>
  );
}
```

---

## 8. Criar o componente `IslandStatsCard`

Crie o arquivo:

```txt
components/island/IslandStatsCard.tsx
```

Com o conteúdo:

```tsx
import { UserIsland } from "@/types/island";

interface IslandStatsCardProps {
  stats: UserIsland["collectionStats"];
}

export function IslandStatsCard({ stats }: IslandStatsCardProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          Recompensas
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRewards}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Mais raro
        </p>
        <p className="mt-2 text-lg font-black text-yellow-400">
          {stats.rarestDuck}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Ravelbox
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.ravelboxesUnlocked}
        </p>
      </div>
    </section>
  );
}
```

---

## 9. Criar o componente principal `IslandPreview`

Crie o arquivo:

```txt
components/island/IslandPreview.tsx
```

Com o conteúdo:

```tsx
import { UserIsland } from "@/types/island";
import { IslandDuck } from "./IslandDuck";
import { IslandItem } from "./IslandItem";

interface IslandPreviewProps {
  island: UserIsland;
}

export function IslandPreview({ island }: IslandPreviewProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      <div className="border-b border-zinc-800 bg-zinc-950/90 px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Ilha pública
        </p>
        <h1 className="mt-1 text-2xl font-black text-white">
          Ilha de {island.owner.displayName}
        </h1>
      </div>

      <div className="relative h-[520px] overflow-hidden bg-gradient-to-b from-sky-400 via-emerald-300 to-yellow-200">
        {/* Céu */}
        <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-white/70 blur-sm" />
        <div className="absolute right-16 top-20 h-16 w-32 rounded-full bg-white/50 blur-sm" />

        {/* Água */}
        <div className="absolute bottom-0 h-40 w-full bg-sky-500/80" />

        {/* Ilha */}
        <div className="absolute left-1/2 top-[58%] h-72 w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-b from-emerald-500 to-emerald-800 shadow-2xl">
          <div className="absolute inset-x-10 bottom-0 h-20 rounded-[50%] bg-yellow-700/80" />
          <div className="absolute left-1/2 top-[48%] h-40 w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-emerald-400/80" />
        </div>

        {/* Objetos da ilha */}
        {island.items.map((item) => (
          <IslandItem key={item.id} item={item} />
        ))}

        {/* Patos */}
        {island.ducks.map((duck) => (
          <IslandDuck key={duck.id} duck={duck} />
        ))}
      </div>
    </section>
  );
}
```

---

## 10. Criar a página `/ilha/[username]`

Crie o arquivo:

```txt
app/ilha/[username]/page.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";
import { IslandPreview } from "@/components/island/IslandPreview";
import { IslandProfileCard } from "@/components/island/IslandProfileCard";
import { IslandStatsCard } from "@/components/island/IslandStatsCard";
import { mockIsland } from "@/lib/island-mock-data";

interface IslandPageProps {
  params: {
    username: string;
  };
}

export default function IslandPage({ params }: IslandPageProps) {
  const island = {
    ...mockIsland,
    owner: {
      ...mockIsland.owner,
      username: params.username,
      displayName:
        params.username.charAt(0).toUpperCase() + params.username.slice(1),
    },
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">
              Ilha pública
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Veja os patinhos, recompensas e itens desbloqueados por este
              colecionador.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/patos/duck-junkrat"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver progresso
            </Link>
          </div>
        </header>

        <IslandStatsCard stats={island.collectionStats} />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <IslandProfileCard
            owner={island.owner}
            backgroundName={island.backgroundName}
          />

          <IslandPreview island={island} />
        </div>
      </div>
    </main>
  );
}
```

---

## 11. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Você pode deixar o link da Etapa 1 e adicionar o link da ilha.

Exemplo:

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
          Abra pacotes, colecione patos, evolua personagens e personalize sua
          ilha.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Ver Pato Junkrat
          </Link>

          <Link
            href="/ilha/ravel"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Ver Ilha do Ravel
          </Link>
        </div>
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
http://localhost:3000/ilha/ravel
```

Você também pode acessar:

```txt
http://localhost:3000/ilha/levi
http://localhost:3000/ilha/guilherme
http://localhost:3000/ilha/jogador123
```

Como ainda estamos usando dados mockados, a ilha será a mesma, mas o nome do usuário mudará conforme a URL.

---

## 13. O que essa etapa entrega

Ao final desta etapa, você terá:

```txt
Página pública de ilha
Ilha visual com fundo, água, solo e objetos
Patinhos posicionados na ilha
Itens decorativos posicionados
Card de perfil do dono da ilha
Estatísticas da coleção
Rota dinâmica por username
Base visual para a galeria futura
```

---

## 14. Por que usar slots fixos agora?

Nesta etapa, os itens e patos usam posição fixa:

```ts
position: {
  left: "42%",
  top: "55%",
}
```

Isso permite criar uma ilha visualmente customizável sem precisar implementar agora:

- drag and drop;
- editor livre;
- colisão entre objetos;
- salvamento complexo;
- cálculo de posição em tempo real.

No futuro, quando conectarmos com Firebase, essas posições poderão ser salvas no banco.

---

## 15. Próximo passo depois da Etapa 2

Depois desta etapa, o próximo passo natural é a **Etapa 3 — Galeria de ilhas**.

Ela vai criar a rota:

```txt
/ilhas
```

Com cards de várias ilhas públicas, permitindo que todos vejam as ilhas dos jogadores.

