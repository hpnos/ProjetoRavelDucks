# Etapa 3 — Galeria pública de ilhas

Nesta etapa vamos criar a página:

```txt
/ilhas
```

Essa página será responsável por mostrar uma lista de ilhas públicas dos jogadores.

Ela complementa a Etapa 2, porque agora não teremos apenas uma ilha individual em:

```txt
/ilha/[username]
```

Também teremos uma galeria para acessar várias ilhas.

---

## 1. Objetivo da etapa

Criar uma página pública onde qualquer pessoa possa ver as ilhas dos jogadores.

A página deve mostrar:

- lista de ilhas;
- card de cada jogador;
- miniatura visual da ilha;
- nome do jogador;
- username;
- quantidade de patos;
- quantidade de recompensas;
- pato mais raro;
- quantidade de Ravelboxes desbloqueadas;
- botão para abrir a ilha completa.

Essa etapa resolve uma parte importante da ideia do Ravel:

> Todo mundo conseguir ver as ilhas de todo mundo.

---

## 2. Estrutura de pastas

Como seu projeto está sem pasta `src`, vamos criar tudo na raiz:

```txt
ravel-ducks/
  app/
    ilhas/
      page.tsx

  components/
    island/
      IslandGalleryCard.tsx
      IslandGalleryGrid.tsx
      IslandMiniPreview.tsx

  lib/
    islands-gallery-mock-data.ts
```

Você já deve ter a pasta:

```txt
components/island
```

por causa da Etapa 2.

Então, dentro dela, vamos adicionar os novos componentes.

---

## 3. Criar dados mockados da galeria

Crie o arquivo:

```txt
lib/islands-gallery-mock-data.ts
```

Com o conteúdo:

```ts
import { UserIsland } from "@/types/island";

export const mockIslandsGallery: UserIsland[] = [
  {
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
    ],
    items: [
      {
        id: "item-junkrat-barrel",
        name: "Barril Explosivo",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "25%",
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
          top: "40%",
        },
      },
    ],
  },
  {
    id: "island-levi",
    owner: {
      id: "user-levi",
      username: "levi",
      displayName: "Levi",
      title: "Guardião da Ilha",
    },
    backgroundName: "Ilha Tropical",
    collectionStats: {
      totalDucks: 4,
      totalRewards: 9,
      rarestDuck: "Pato Rei",
      ravelboxesUnlocked: 1,
    },
    ducks: [
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 3,
        rarity: "common",
        position: {
          left: "38%",
          top: "60%",
        },
      },
      {
        id: "duck-king",
        name: "Pato Rei",
        level: 1,
        rarity: "legendary",
        position: {
          left: "58%",
          top: "57%",
        },
      },
    ],
    items: [
      {
        id: "item-tree",
        name: "Coqueiro",
        type: "decoration",
        slot: "right_decoration",
        position: {
          left: "76%",
          top: "55%",
        },
      },
    ],
  },
  {
    id: "island-guilherme",
    owner: {
      id: "user-guilherme",
      username: "guilherme",
      displayName: "Guilherme",
      title: "Caçador de Ravelbox",
    },
    backgroundName: "Ilha Noturna",
    collectionStats: {
      totalDucks: 10,
      totalRewards: 26,
      rarestDuck: "Pato Sombra",
      ravelboxesUnlocked: 4,
    },
    ducks: [
      {
        id: "duck-shadow",
        name: "Pato Sombra",
        level: 6,
        rarity: "legendary",
        position: {
          left: "45%",
          top: "56%",
        },
      },
      {
        id: "duck-junkrat",
        name: "Pato Junkrat",
        level: 5,
        rarity: "epic",
        position: {
          left: "62%",
          top: "61%",
        },
      },
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 2,
        rarity: "common",
        position: {
          left: "28%",
          top: "64%",
        },
      },
    ],
    items: [
      {
        id: "item-moon-banner",
        name: "Estandarte Lunar",
        type: "special",
        slot: "special_item",
        position: {
          left: "70%",
          top: "42%",
        },
      },
      {
        id: "item-rock",
        name: "Pedra Mística",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "22%",
          top: "67%",
        },
      },
    ],
  },
  {
    id: "island-player123",
    owner: {
      id: "user-player123",
      username: "player123",
      displayName: "Player123",
      title: "Novo Colecionador",
    },
    backgroundName: "Ilha Inicial",
    collectionStats: {
      totalDucks: 2,
      totalRewards: 3,
      rarestDuck: "Pato Clássico",
      ravelboxesUnlocked: 0,
    },
    ducks: [
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 1,
        rarity: "common",
        position: {
          left: "48%",
          top: "60%",
        },
      },
    ],
    items: [
      {
        id: "item-small-tree",
        name: "Árvore Pequena",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "30%",
          top: "62%",
        },
      },
    ],
  },
];
```

---

## 4. Criar o componente `IslandMiniPreview`

Esse componente será uma versão pequena da ilha, para aparecer dentro do card da galeria.

Crie o arquivo:

```txt
components/island/IslandMiniPreview.tsx
```

Com o conteúdo:

```tsx
import { UserIsland } from "@/types/island";

interface IslandMiniPreviewProps {
  island: UserIsland;
}

const rarityRing = {
  common: "ring-zinc-400",
  rare: "ring-sky-400",
  epic: "ring-purple-400",
  legendary: "ring-yellow-400",
};

const itemIcon = {
  duck: "🦆",
  decoration: "🌴",
  accessory: "🎩",
  background: "🏝️",
  special: "🚩",
};

export function IslandMiniPreview({ island }: IslandMiniPreviewProps) {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-sky-400 via-emerald-300 to-yellow-200">
      {/* Céu */}
      <div className="absolute left-6 top-5 h-10 w-16 rounded-full bg-white/60 blur-sm" />
      <div className="absolute right-6 top-8 h-8 w-14 rounded-full bg-white/50 blur-sm" />

      {/* Água */}
      <div className="absolute bottom-0 h-14 w-full bg-sky-500/80" />

      {/* Ilha */}
      <div className="absolute left-1/2 top-[58%] h-28 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-b from-emerald-500 to-emerald-800 shadow-xl">
        <div className="absolute inset-x-8 bottom-0 h-8 rounded-[50%] bg-yellow-700/80" />
        <div className="absolute left-1/2 top-[45%] h-14 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-emerald-400/80" />
      </div>

      {/* Itens */}
      {island.items.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/70 text-lg shadow-lg"
          style={{
            left: item.position.left,
            top: item.position.top,
          }}
          title={item.name}
        >
          {itemIcon[item.type]}
        </div>
      ))}

      {/* Patos */}
      {island.ducks.slice(0, 3).map((duck) => (
        <div
          key={duck.id}
          className={[
            "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950/80 text-xl shadow-lg ring-2",
            rarityRing[duck.rarity],
          ].join(" ")}
          style={{
            left: duck.position.left,
            top: duck.position.top,
          }}
          title={`${duck.name} - nível ${duck.level}`}
        >
          🦆
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Criar o componente `IslandGalleryCard`

Crie o arquivo:

```txt
components/island/IslandGalleryCard.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";
import { UserIsland } from "@/types/island";
import { IslandMiniPreview } from "./IslandMiniPreview";

interface IslandGalleryCardProps {
  island: UserIsland;
}

export function IslandGalleryCard({ island }: IslandGalleryCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-yellow-500/10">
      <IslandMiniPreview island={island} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">
              {island.owner.displayName}
            </h2>
            <p className="text-sm text-zinc-500">@{island.owner.username}</p>
          </div>

          <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-400">
            Ilha
          </div>
        </div>

        <p className="mt-3 text-sm text-zinc-400">{island.owner.title}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.totalDucks}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.totalRewards}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Mais raro
            </p>
            <p className="mt-1 text-sm font-black text-yellow-400">
              {island.collectionStats.rarestDuck}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Ravelbox
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.ravelboxesUnlocked}
            </p>
          </div>
        </div>

        <Link
          href={`/ilha/${island.owner.username}`}
          className="mt-5 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Visitar ilha
        </Link>
      </div>
    </article>
  );
}
```

---

## 6. Criar o componente `IslandGalleryGrid`

Crie o arquivo:

```txt
components/island/IslandGalleryGrid.tsx
```

Com o conteúdo:

```tsx
import { UserIsland } from "@/types/island";
import { IslandGalleryCard } from "./IslandGalleryCard";

interface IslandGalleryGridProps {
  islands: UserIsland[];
}

export function IslandGalleryGrid({ islands }: IslandGalleryGridProps) {
  if (islands.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
        <h2 className="text-2xl font-black text-white">
          Nenhuma ilha encontrada
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Quando os jogadores criarem suas ilhas, elas aparecerão aqui.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {islands.map((island) => (
        <IslandGalleryCard key={island.id} island={island} />
      ))}
    </section>
  );
}
```

---

## 7. Criar a página `/ilhas`

Crie o arquivo:

```txt
app/ilhas/page.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";
import { IslandGalleryGrid } from "@/components/island/IslandGalleryGrid";
import { mockIslandsGallery } from "@/lib/islands-gallery-mock-data";

export default function IslandsGalleryPage() {
  const totalIslands = mockIslandsGallery.length;

  const totalDucks = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.totalDucks,
    0
  );

  const totalRewards = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.totalRewards,
    0
  );

  const totalRavelboxes = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.ravelboxesUnlocked,
    0
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Galeria de ilhas
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Explore as ilhas públicas dos colecionadores, veja seus patinhos,
              recompensas desbloqueadas e visite os perfis da comunidade.
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
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver ilha exemplo
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Ilhas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalIslands}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalDucks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalRewards}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Ravelbox
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalRavelboxes}
            </p>
          </div>
        </section>

        <IslandGalleryGrid islands={mockIslandsGallery} />
      </div>
    </main>
  );
}
```

---

## 8. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Adicione um link para a galeria.

Você pode substituir o conteúdo atual por este:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
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

          <Link
            href="/ilhas"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Galeria de Ilhas
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## 9. Rodar o projeto

No terminal:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000/ilhas
```

Você deve ver a página de galeria com os cards das ilhas mockadas.

---

## 10. Testar os links

Na galeria, clique em:

```txt
Visitar ilha
```

O sistema deve levar para:

```txt
/ilha/ravel
/ilha/levi
/ilha/guilherme
/ilha/player123
```

Como a Etapa 2 ainda usa uma ilha mockada única, todas as páginas individuais terão a mesma ilha base, mas com o nome vindo da URL.

Isso será corrigido depois quando conectarmos os dados reais.

---

## 11. O que essa etapa entrega

Ao final da Etapa 3, você terá:

```txt
Página /ilhas
Grid de ilhas públicas
Cards de jogadores
Miniatura visual da ilha
Resumo de coleção por jogador
Botão para visitar ilha individual
Estatísticas gerais da comunidade
```

---

## 12. Limitações desta etapa

Nesta etapa ainda temos algumas limitações:

- os dados são mockados;
- os filtros ainda não existem;
- a busca por username ainda não existe;
- as páginas individuais ainda não carregam a ilha real de cada usuário;
- ainda não há Firebase;
- ainda não há autenticação.

Tudo isso será resolvido nas próximas etapas.

---

## 13. Melhorias futuras para a galeria

Depois, podemos evoluir esta tela com:

- campo de busca por nome;
- filtro por maior coleção;
- filtro por mais Ravelboxes;
- ordenação por patos mais raros;
- ranking;
- destaque da ilha da semana;
- paginação;
- carregamento real pelo Firebase.

---

## 14. Próxima etapa

Depois da Galeria de Ilhas, a próxima etapa será:

```txt
Etapa 4 — Coleção do usuário
```

Rota:

```txt
/colecao
```

Nessa etapa vamos mostrar todos os patos que o usuário possui, com nível, XP, raridade e botão para acessar a progressão de cada pato.

