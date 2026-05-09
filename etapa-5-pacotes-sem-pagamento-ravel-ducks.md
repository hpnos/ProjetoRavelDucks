# Etapa 5 — Pacotes sem pagamento

Nesta etapa vamos criar a página:

```txt
/pacotes
```

Essa página será responsável por mostrar os pacotes liberados para o usuário abrir.

Como já definimos, **não teremos pagamento dentro da plataforma**.

O fluxo será:

```txt
Ravel vende/combina/libera algo durante a live
        ↓
Ravel libera o pacote no painel admin
        ↓
Usuário acessa /pacotes
        ↓
Usuário abre o pacote
        ↓
Sistema revela 3 ou 4 cartas
        ↓
Cartas simulam desbloqueio de pato, item, XP ou Ravelbox
```

Nesta etapa ainda vamos usar **dados mockados**, sem Firebase e sem painel admin real.

---

## 1. Objetivo da etapa

Criar uma tela onde o usuário consiga:

- ver pacotes disponíveis;
- ver pacotes já abertos;
- abrir um pacote;
- revelar cartas;
- visualizar o tipo de cada carta;
- simular cartas novas e duplicadas;
- simular XP para patos;
- simular Ravelbox;
- preparar a base para conectar com a coleção futuramente.

---

## 2. Estrutura de pastas

Como seu projeto está sem pasta `src`, vamos criar tudo diretamente na raiz.

Estrutura desta etapa:

```txt
ravel-ducks/
  app/
    pacotes/
      page.tsx

  components/
    packs/
      PackCard.tsx
      OpenPackModal.tsx
      ReceivedCard.tsx
      PackSummary.tsx

  lib/
    packs-mock-data.ts

  types/
    pack.ts
```

---

## 3. Criar os tipos dos pacotes

Crie o arquivo:

```txt
types/pack.ts
```

Com o conteúdo:

```ts
export type PackStatus = "available" | "opened" | "expired";

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export type CardType =
  | "duck"
  | "duck_xp"
  | "island_item"
  | "accessory"
  | "border"
  | "pin"
  | "digital_art"
  | "ravelbox";

export interface Pack {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  status: PackStatus;
  source: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  createdAt: string;
}

export interface PackCardReward {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  duckId?: string;
  xpAmount?: number;
  isDuplicate?: boolean;
}
```

---

## 4. Criar os dados mockados dos pacotes

Crie o arquivo:

```txt
lib/packs-mock-data.ts
```

Com o conteúdo:

```ts
import { Pack, PackCardReward } from "@/types/pack";

export const mockPacks: Pack[] = [
  {
    id: "pack-live-001",
    name: "Pacote da Live",
    description: "Pacote liberado durante a live do Ravel.",
    cardsQuantity: 4,
    status: "available",
    source: "live_purchase",
    createdAt: "2026-05-09",
  },
  {
    id: "pack-event-001",
    name: "Pacote Evento Especial",
    description: "Recompensa especial por participação no evento.",
    cardsQuantity: 3,
    status: "available",
    source: "event_reward",
    createdAt: "2026-05-09",
  },
  {
    id: "pack-opened-001",
    name: "Pacote Antigo",
    description: "Pacote já aberto anteriormente.",
    cardsQuantity: 3,
    status: "opened",
    source: "manual_bonus",
    createdAt: "2026-05-08",
  },
];

export const mockCardPool: PackCardReward[] = [
  {
    id: "card-duck-junkrat",
    name: "Pato Junkrat",
    description: "Desbloqueia o Pato Junkrat ou vira XP se já estiver na coleção.",
    type: "duck",
    rarity: "epic",
    duckId: "duck-junkrat",
  },
  {
    id: "card-xp-junkrat",
    name: "XP Junkrat +100",
    description: "Adiciona 100 XP ao Pato Junkrat.",
    type: "duck_xp",
    rarity: "rare",
    duckId: "duck-junkrat",
    xpAmount: 100,
  },
  {
    id: "card-island-barrel",
    name: "Barril Explosivo",
    description: "Acessório temático para decorar sua ilha.",
    type: "island_item",
    rarity: "rare",
    duckId: "duck-junkrat",
  },
  {
    id: "card-border-junkrat",
    name: "Borda Junkrat",
    description: "Borda temática para o perfil.",
    type: "border",
    rarity: "rare",
    duckId: "duck-junkrat",
  },
  {
    id: "card-pin-junkrat",
    name: "Pin Junkrat",
    description: "Pin colecionável do Pato Junkrat.",
    type: "pin",
    rarity: "common",
    duckId: "duck-junkrat",
  },
  {
    id: "card-ravelbox",
    name: "Ravelbox",
    description: "Recompensa especial que fica pendente para o Ravel entregar.",
    type: "ravelbox",
    rarity: "legendary",
  },
  {
    id: "card-duck-king",
    name: "Pato Rei",
    description: "Desbloqueia o Pato Rei ou vira XP se já estiver na coleção.",
    type: "duck",
    rarity: "legendary",
    duckId: "duck-king",
  },
  {
    id: "card-digital-art",
    name: "Arte HD Pato Junkrat",
    description: "Arte digital em alta definição do Pato Junkrat.",
    type: "digital_art",
    rarity: "epic",
    duckId: "duck-junkrat",
  },
];

export function openMockPack(cardsQuantity: number): PackCardReward[] {
  const shuffled = [...mockCardPool].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, cardsQuantity).map((card, index) => {
    if (index === 0 && card.type === "duck") {
      return {
        ...card,
        isDuplicate: true,
        description:
          "Carta duplicada: será convertida em XP para este pato futuramente.",
      };
    }

    return card;
  });
}
```

---

## 5. Criar o componente `ReceivedCard`

Crie o arquivo:

```txt
components/packs/ReceivedCard.tsx
```

Com o conteúdo:

```tsx
import { PackCardReward } from "@/types/pack";

interface ReceivedCardProps {
  card: PackCardReward;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const rarityStyle = {
  common: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  rare: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  epic: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  legendary: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

const typeIcon = {
  duck: "🦆",
  duck_xp: "✨",
  island_item: "🏝️",
  accessory: "🎩",
  border: "🖼️",
  pin: "📌",
  digital_art: "🎨",
  ravelbox: "🎁",
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

export function ReceivedCard({ card }: ReceivedCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl">
      <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black text-6xl">
        {typeIcon[card.type]}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span
          className={[
            "rounded-full border px-3 py-1 text-[10px] font-bold uppercase",
            rarityStyle[card.rarity],
          ].join(" ")}
        >
          {rarityLabel[card.rarity]}
        </span>

        <span className="text-[10px] font-bold uppercase text-zinc-500">
          {typeLabel[card.type]}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-black text-white">{card.name}</h3>

      <p className="mt-2 min-h-[44px] text-sm text-zinc-400">
        {card.description}
      </p>

      {card.isDuplicate && (
        <div className="mt-3 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-3 text-xs font-bold text-yellow-300">
          Duplicata: vira XP
        </div>
      )}

      {card.xpAmount && (
        <div className="mt-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-300">
          +{card.xpAmount} XP
        </div>
      )}
    </article>
  );
}
```

---

## 6. Criar o componente `PackSummary`

Crie o arquivo:

```txt
components/packs/PackSummary.tsx
```

Com o conteúdo:

```tsx
import { PackCardReward } from "@/types/pack";

interface PackSummaryProps {
  cards: PackCardReward[];
}

export function PackSummary({ cards }: PackSummaryProps) {
  const ducks = cards.filter((card) => card.type === "duck").length;
  const xpCards = cards.filter((card) => card.type === "duck_xp").length;
  const ravelboxes = cards.filter((card) => card.type === "ravelbox").length;
  const duplicates = cards.filter((card) => card.isDuplicate).length;

  return (
    <section className="grid gap-3 sm:grid-cols-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Patos</p>
        <p className="mt-1 text-2xl font-black text-white">{ducks}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">XP</p>
        <p className="mt-1 text-2xl font-black text-white">{xpCards}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Ravelbox</p>
        <p className="mt-1 text-2xl font-black text-yellow-400">
          {ravelboxes}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Duplicatas</p>
        <p className="mt-1 text-2xl font-black text-white">{duplicates}</p>
      </div>
    </section>
  );
}
```

---

## 7. Criar o componente `OpenPackModal`

Crie o arquivo:

```txt
components/packs/OpenPackModal.tsx
```

Com o conteúdo:

```tsx
"use client";

import { Pack, PackCardReward } from "@/types/pack";
import { ReceivedCard } from "./ReceivedCard";
import { PackSummary } from "./PackSummary";

interface OpenPackModalProps {
  pack: Pack | null;
  cards: PackCardReward[];
  onClose: () => void;
}

export function OpenPackModal({ pack, cards, onClose }: OpenPackModalProps) {
  if (!pack) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <section className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Pacote aberto
            </p>
            <h2 className="mt-1 text-3xl font-black text-white">
              {pack.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Essas foram as cartas reveladas neste pacote.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Fechar
          </button>
        </header>

        <div className="mt-6">
          <PackSummary cards={cards} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <ReceivedCard key={`${card.id}-${Math.random()}`} card={card} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
          Nesta versão mockada, as cartas ainda não são salvas na coleção.
          Futuramente, pato novo será adicionado ao inventário, duplicata virará
          XP e Ravelbox entrará como recompensa pendente no painel admin.
        </div>
      </section>
    </div>
  );
}
```

---

## 8. Criar o componente `PackCard`

Crie o arquivo:

```txt
components/packs/PackCard.tsx
```

Com o conteúdo:

```tsx
import { Pack } from "@/types/pack";

interface PackCardProps {
  pack: Pack;
  onOpen: (pack: Pack) => void;
}

const sourceLabel = {
  live_purchase: "Live",
  event_reward: "Evento",
  manual_bonus: "Bônus",
  admin: "Admin",
};

const statusLabel = {
  available: "Disponível",
  opened: "Aberto",
  expired: "Expirado",
};

const statusStyle = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  opened: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  expired: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function PackCard({ pack, onOpen }: PackCardProps) {
  const isAvailable = pack.status === "available";

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-yellow-500/10">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-yellow-400/20 via-orange-500/10 to-black">
        <div className="absolute left-4 top-4 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-300">
          {sourceLabel[pack.source]}
        </div>

        <div
          className={[
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold uppercase",
            statusStyle[pack.status],
          ].join(" ")}
        >
          {statusLabel[pack.status]}
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-yellow-400/40 bg-zinc-950/70 text-6xl shadow-xl">
          🎴
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-black text-white">{pack.name}</h2>

        <p className="mt-2 min-h-[44px] text-sm text-zinc-400">
          {pack.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Cartas
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {pack.cardsQuantity}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Data
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {pack.createdAt}
            </p>
          </div>
        </div>

        <button
          disabled={!isAvailable}
          onClick={() => onOpen(pack)}
          className={[
            "mt-6 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-black transition",
            isAvailable
              ? "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500",
          ].join(" ")}
        >
          {isAvailable ? "Abrir pacote" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
```

---

## 9. Criar a página `/pacotes`

Crie o arquivo:

```txt
app/pacotes/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { OpenPackModal } from "@/components/packs/OpenPackModal";
import { PackCard } from "@/components/packs/PackCard";
import { mockPacks, openMockPack } from "@/lib/packs-mock-data";
import { Pack, PackCardReward } from "@/types/pack";

export default function PacksPage() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [receivedCards, setReceivedCards] = useState<PackCardReward[]>([]);

  const availablePacks = mockPacks.filter((pack) => pack.status === "available");
  const openedPacks = mockPacks.filter((pack) => pack.status === "opened");

  function handleOpenPack(pack: Pack) {
    const cards = openMockPack(pack.cardsQuantity);

    setSelectedPack(pack);
    setReceivedCards(cards);
  }

  function handleCloseModal() {
    setSelectedPack(null);
    setReceivedCards([]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Meus pacotes
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Aqui aparecem os pacotes liberados pelo Ravel durante a live,
              eventos ou recompensas manuais. Não existe pagamento dentro da
              plataforma.
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
              href="/colecao"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Coleção
            </Link>

            <Link
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Minha ilha
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Disponíveis
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {availablePacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Abertos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {openedPacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {mockPacks.length}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Pacotes disponíveis
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Abra os pacotes liberados durante a live.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {availablePacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} onOpen={handleOpenPack} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Histórico de pacotes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pacotes já abertos ou indisponíveis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {openedPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} onOpen={handleOpenPack} />
            ))}
          </div>
        </section>
      </div>

      <OpenPackModal
        pack={selectedPack}
        cards={receivedCards}
        onClose={handleCloseModal}
      />
    </main>
  );
}
```

---

## 10. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Adicione um link para `/pacotes`.

Você pode substituir o conteúdo atual por este:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
            Ilha
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
            Coleção
          </Link>

          <Link
            href="/pacotes"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Pacotes
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## 11. Rodar o projeto

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
http://localhost:3000/pacotes
```

---

## 12. Testar a abertura de pacote

Na página `/pacotes`:

1. clique em **Abrir pacote**;
2. o modal deve aparecer;
3. as cartas devem ser reveladas;
4. o resumo deve mostrar quantas cartas de cada tipo vieram;
5. clique em **Fechar** para voltar.

Como ainda é mockado, abrir o mesmo pacote não muda o status dele para aberto.

Isso será resolvido depois com Firebase.

---

## 13. O que essa etapa entrega

Ao final da Etapa 5, você terá:

```txt
Página /pacotes
Lista de pacotes disponíveis
Histórico de pacotes abertos
Modal de abertura de pacote
Cartas reveladas
Tipos de carta
Raridades
Simulação de duplicata virando XP
Simulação de Ravelbox
Fluxo sem pagamento dentro da plataforma
```

---

## 14. Limitações desta etapa

Nesta etapa ainda temos:

- dados mockados;
- pacote não muda status após abrir;
- cartas não entram na coleção real;
- XP não altera o pato real;
- Ravelbox não cria pendência real;
- não existe admin liberando pacote;
- não existe Firebase;
- não existe autenticação.

Essas limitações serão tratadas nas próximas etapas.

---

## 15. Próxima etapa

Depois dos Pacotes sem pagamento, a próxima etapa será:

```txt
Etapa 6 — Painel admin visual
```

Rotas previstas:

```txt
/admin
/admin/patos
/admin/cartas
/admin/pacotes
/admin/liberar-pacote
/admin/ravelboxes
```

Nessa etapa vamos criar a base visual do painel do Ravel, ainda mockada, para ele conseguir visualizar como controlaria:

```txt
cadastro de patos
cadastro de cartas
cadastro de pacotes
liberação de pacote para usuário
Ravelboxes pendentes
histórico de aberturas
```
