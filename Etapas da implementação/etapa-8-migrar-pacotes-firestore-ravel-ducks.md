# Etapa 8 — Migrar pacotes para Firestore

Nesta etapa vamos começar a transformar o fluxo de pacotes em dados reais do Firestore.

Até agora a tela `/pacotes` usa dados mockados em:

```txt
lib/packs-mock-data.ts
```

Agora vamos criar o primeiro fluxo real:

```txt
Admin libera pacote para usuário
        ↓
Registro é salvo em grantedPacks
        ↓
Usuário logado acessa /pacotes
        ↓
Sistema busca pacotes reais do usuário
        ↓
Usuário abre pacote
        ↓
Sistema sorteia cartas reais
        ↓
Cria histórico em packOpenings
        ↓
Marca o pacote como opened
```

Nesta etapa, o foco é migrar **pacotes liberados**, **abertura de pacotes** e **histórico de abertura**.

---

## 1. Objetivo da etapa

Implementar o fluxo real de pacotes usando Firebase:

- criar serviço para pacotes;
- criar serviço para cartas;
- criar serviço para pacotes liberados;
- criar serviço de abertura de pacotes;
- permitir que admin libere pacote para usuário;
- carregar pacotes reais em `/pacotes`;
- abrir pacote real;
- sortear cartas com base no pool do pacote;
- salvar abertura em `packOpenings`;
- atualizar status do pacote liberado para `opened`.

Ainda não vamos atualizar a coleção real do usuário nesta etapa.

A lógica de adicionar pato, converter duplicata em XP e liberar recompensa real será tratada na etapa seguinte.

---

## 2. Coleções do Firestore usadas nesta etapa

Vamos usar estas coleções:

```txt
packs
cards
grantedPacks
packOpenings
users
```

### `packs`

Representa o modelo do pacote.

Exemplo:

```ts
{
  id: "pack-live",
  name: "Pacote da Live",
  description: "Pacote liberado durante a live.",
  cardsQuantity: 4,
  cardPool: ["card-duck-junkrat", "card-xp-junkrat", "card-ravelbox"],
  active: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `cards`

Representa as cartas que podem sair em pacotes.

Exemplo:

```ts
{
  id: "card-duck-junkrat",
  name: "Pato Junkrat",
  description: "Desbloqueia o Pato Junkrat ou vira XP.",
  type: "duck",
  rarity: "epic",
  duckId: "duck-junkrat",
  active: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `grantedPacks`

Representa um pacote liberado para um usuário.

Exemplo:

```ts
{
  id: "granted-001",
  userId: "UID_DO_USUARIO",
  packId: "pack-live",
  status: "available",
  reason: "live_purchase",
  grantedBy: "UID_DO_ADMIN",
  createdAt: Timestamp,
  openedAt: null
}
```

### `packOpenings`

Representa o histórico de abertura de um pacote.

Exemplo:

```ts
{
  id: "opening-001",
  userId: "UID_DO_USUARIO",
  packId: "pack-live",
  grantedPackId: "granted-001",
  cardsReceived: ["card-duck-junkrat", "card-xp-junkrat", "card-ravelbox"],
  createdAt: Timestamp
}
```

---

## 3. Estrutura de arquivos

Crie ou atualize estes arquivos:

```txt
services/
  cards-service.ts
  packs-service.ts
  granted-packs-service.ts
  pack-openings-service.ts

app/
  admin/
    liberar-pacote/
      page.tsx
    seed-packs/
      page.tsx
  pacotes/
    page.tsx

components/
  packs/
    RealPackCard.tsx
    RealOpenPackModal.tsx
    RealReceivedCard.tsx

types/
  database.ts
```

---

## 4. Atualizar tipos em `types/database.ts`

Abra:

```txt
types/database.ts
```

Confirme se já existem os tipos criados na Etapa 7.

Agora adicione ou ajuste o tipo `PackOpeningDocument`:

```ts
export interface PackOpeningDocument {
  id: string;
  userId: string;
  packId: string;
  grantedPackId: string;
  cardsReceived: string[];
  createdAt: Date;
}
```

E adicione este tipo auxiliar:

```ts
export interface ResolvedGrantedPack {
  id: string;
  userId: string;
  packId: string;
  status: PackStatus;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
  createdAt: Date;
  openedAt?: Date;
  pack: PackDocument;
}
```

---

## 5. Criar serviço de cartas

Crie:

```txt
services/cards-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CardDocument, CardType, Rarity } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreateCardInput {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
}

export async function createCard(input: CreateCardInput) {
  const cardRef = doc(db, "cards", input.id);

  await setDoc(cardRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getCardById(cardId: string) {
  const cardRef = doc(db, "cards", cardId);
  const snapshot = await getDoc(cardRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as CardDocument;
}

export async function listActiveCards() {
  const cardsRef = collection(db, "cards");
  const cardsQuery = query(cardsRef, where("active", "==", true));

  const snapshot = await getDocs(cardsQuery);

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

export async function getCardsByIds(cardIds: string[]) {
  const cards = await Promise.all(cardIds.map((cardId) => getCardById(cardId)));

  return cards.filter((card): card is CardDocument => Boolean(card));
}
```

---

## 6. Criar serviço de pacotes

Crie:

```txt
services/packs-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { PackDocument } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreatePackInput {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
}

export async function createPack(input: CreatePackInput) {
  const packRef = doc(db, "packs", input.id);

  await setDoc(packRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getPackById(packId: string) {
  const packRef = doc(db, "packs", packId);
  const snapshot = await getDoc(packRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as PackDocument;
}

export async function listActivePacks() {
  const packsRef = collection(db, "packs");
  const packsQuery = query(packsRef, where("active", "==", true));

  const snapshot = await getDocs(packsQuery);

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
```

---

## 7. Criar serviço de pacotes liberados

Crie:

```txt
services/granted-packs-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  GrantedPackDocument,
  PackStatus,
  ResolvedGrantedPack,
} from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { getPackById } from "./packs-service";

interface GrantPackInput {
  userId: string;
  packId: string;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
}

export async function grantPackToUser(input: GrantPackInput) {
  const grantedPackRef = doc(collection(db, "grantedPacks"));

  await setDoc(grantedPackRef, {
    id: grantedPackRef.id,
    userId: input.userId,
    packId: input.packId,
    status: "available",
    reason: input.reason,
    grantedBy: input.grantedBy,
    createdAt: serverTimestamp(),
  });

  return grantedPackRef.id;
}

export async function listGrantedPacksByUser(userId: string) {
  const grantedPacksRef = collection(db, "grantedPacks");

  const grantedPacksQuery = query(
    grantedPacksRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(grantedPacksQuery);

  const grantedPacks = snapshot.docs.map((grantedPackDocument) => {
    const data = grantedPackDocument.data();

    return {
      ...data,
      id: grantedPackDocument.id,
      createdAt: timestampToDate(data.createdAt),
      openedAt: data.openedAt ? timestampToDate(data.openedAt) : undefined,
    } as GrantedPackDocument;
  });

  const resolvedPacks = await Promise.all(
    grantedPacks.map(async (grantedPack) => {
      const pack = await getPackById(grantedPack.packId);

      if (!pack) {
        return null;
      }

      return {
        ...grantedPack,
        pack,
      } as ResolvedGrantedPack;
    })
  );

  return resolvedPacks.filter(
    (pack): pack is ResolvedGrantedPack => Boolean(pack)
  );
}

export async function updateGrantedPackStatus(
  grantedPackId: string,
  status: PackStatus
) {
  const grantedPackRef = doc(db, "grantedPacks", grantedPackId);

  await updateDoc(grantedPackRef, {
    status,
    openedAt: status === "opened" ? serverTimestamp() : null,
  });
}
```

---

## 8. Criar serviço de abertura de pacotes

Crie:

```txt
services/pack-openings-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CardDocument } from "@/types/database";
import { getCardsByIds } from "./cards-service";

interface OpenGrantedPackInput {
  userId: string;
  grantedPackId: string;
}

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function openGrantedPack(input: OpenGrantedPackInput) {
  const grantedPackRef = doc(db, "grantedPacks", input.grantedPackId);
  const openingRef = doc(collection(db, "packOpenings"));

  const result = await runTransaction(db, async (transaction) => {
    const grantedPackSnapshot = await transaction.get(grantedPackRef);

    if (!grantedPackSnapshot.exists()) {
      throw new Error("Pacote liberado não encontrado.");
    }

    const grantedPack = grantedPackSnapshot.data();

    if (grantedPack.userId !== input.userId) {
      throw new Error("Este pacote não pertence ao usuário autenticado.");
    }

    if (grantedPack.status !== "available") {
      throw new Error("Este pacote não está disponível para abertura.");
    }

    const packRef = doc(db, "packs", grantedPack.packId);
    const packSnapshot = await transaction.get(packRef);

    if (!packSnapshot.exists()) {
      throw new Error("Modelo de pacote não encontrado.");
    }

    const pack = packSnapshot.data();

    if (!pack.active) {
      throw new Error("Este modelo de pacote está inativo.");
    }

    const cardPool: string[] = pack.cardPool ?? [];
    const cardsQuantity: number = pack.cardsQuantity ?? 3;

    if (cardPool.length === 0) {
      throw new Error("Este pacote não possui cartas configuradas.");
    }

    const selectedCardIds = shuffleArray(cardPool).slice(0, cardsQuantity);

    transaction.set(openingRef, {
      id: openingRef.id,
      userId: input.userId,
      packId: grantedPack.packId,
      grantedPackId: input.grantedPackId,
      cardsReceived: selectedCardIds,
      createdAt: serverTimestamp(),
    });

    transaction.update(grantedPackRef, {
      status: "opened",
      openedAt: serverTimestamp(),
    });

    return {
      openingId: openingRef.id,
      cardIds: selectedCardIds,
    };
  });

  const cards = await getCardsByIds(result.cardIds);

  return {
    openingId: result.openingId,
    cards: cards as CardDocument[],
  };
}
```

---

## 9. Criar componente `RealReceivedCard`

Crie:

```txt
components/packs/RealReceivedCard.tsx
```

Com o conteúdo:

```tsx
import { CardDocument } from "@/types/database";

interface RealReceivedCardProps {
  card: CardDocument;
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

export function RealReceivedCard({ card }: RealReceivedCardProps) {
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

## 10. Criar componente `RealOpenPackModal`

Crie:

```txt
components/packs/RealOpenPackModal.tsx
```

Com o conteúdo:

```tsx
"use client";

import { CardDocument, ResolvedGrantedPack } from "@/types/database";
import { RealReceivedCard } from "./RealReceivedCard";

interface RealOpenPackModalProps {
  pack: ResolvedGrantedPack | null;
  cards: CardDocument[];
  error?: string;
  onClose: () => void;
}

export function RealOpenPackModal({
  pack,
  cards,
  error,
  onClose,
}: RealOpenPackModalProps) {
  if (!pack) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <section className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Resultado da abertura
            </p>

            <h2 className="mt-1 text-3xl font-black text-white">
              {pack.pack.name}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Cartas reveladas neste pacote.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Fechar
          </button>
        </header>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {error}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <RealReceivedCard key={card.id} card={card} />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
          Nesta etapa, as cartas são sorteadas e o histórico é salvo no
          Firestore. A atualização real da coleção e XP será feita na próxima
          etapa.
        </div>
      </section>
    </div>
  );
}
```

---

## 11. Criar componente `RealPackCard`

Crie:

```txt
components/packs/RealPackCard.tsx
```

Com o conteúdo:

```tsx
import { ResolvedGrantedPack } from "@/types/database";

interface RealPackCardProps {
  grantedPack: ResolvedGrantedPack;
  onOpen: (grantedPack: ResolvedGrantedPack) => void;
  isOpening?: boolean;
}

const reasonLabel = {
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

export function RealPackCard({
  grantedPack,
  onOpen,
  isOpening,
}: RealPackCardProps) {
  const isAvailable = grantedPack.status === "available";

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-yellow-500/10">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-yellow-400/20 via-orange-500/10 to-black">
        <div className="absolute left-4 top-4 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-300">
          {reasonLabel[grantedPack.reason]}
        </div>

        <div
          className={[
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold uppercase",
            statusStyle[grantedPack.status],
          ].join(" ")}
        >
          {statusLabel[grantedPack.status]}
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-yellow-400/40 bg-zinc-950/70 text-6xl shadow-xl">
          🎴
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-black text-white">
          {grantedPack.pack.name}
        </h2>

        <p className="mt-2 min-h-[44px] text-sm text-zinc-400">
          {grantedPack.pack.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Cartas
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {grantedPack.pack.cardsQuantity}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Pool
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {grantedPack.pack.cardPool.length}
            </p>
          </div>
        </div>

        <button
          disabled={!isAvailable || isOpening}
          onClick={() => onOpen(grantedPack)}
          className={[
            "mt-6 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-black transition",
            isAvailable
              ? "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500",
          ].join(" ")}
        >
          {isOpening ? "Abrindo..." : isAvailable ? "Abrir pacote" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
```

---

## 12. Atualizar página `/pacotes` para usar Firestore

Substitua o conteúdo de:

```txt
app/pacotes/page.tsx
```

Por:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RealOpenPackModal } from "@/components/packs/RealOpenPackModal";
import { RealPackCard } from "@/components/packs/RealPackCard";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listGrantedPacksByUser } from "@/services/granted-packs-service";
import { openGrantedPack } from "@/services/pack-openings-service";
import { CardDocument, ResolvedGrantedPack } from "@/types/database";

export default function PacksPage() {
  const { user, isLoading: isAuthLoading } = useAuthUser();

  const [grantedPacks, setGrantedPacks] = useState<ResolvedGrantedPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<ResolvedGrantedPack | null>(
    null
  );
  const [receivedCards, setReceivedCards] = useState<CardDocument[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [modalError, setModalError] = useState("");

  const availablePacks = grantedPacks.filter(
    (pack) => pack.status === "available"
  );

  const openedPacks = grantedPacks.filter((pack) => pack.status === "opened");

  async function loadPacks(userId: string) {
    try {
      setIsLoadingPacks(true);

      const packs = await listGrantedPacksByUser(userId);

      setGrantedPacks(packs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPacks(false);
    }
  }

  async function handleOpenPack(pack: ResolvedGrantedPack) {
    if (!user) {
      return;
    }

    try {
      setIsOpening(true);
      setModalError("");
      setSelectedPack(pack);

      const result = await openGrantedPack({
        userId: user.uid,
        grantedPackId: pack.id,
      });

      setReceivedCards(result.cards);

      await loadPacks(user.uid);
    } catch (error) {
      console.error(error);
      setModalError(
        error instanceof Error
          ? error.message
          : "Erro ao abrir pacote. Tente novamente."
      );
    } finally {
      setIsOpening(false);
    }
  }

  function handleCloseModal() {
    setSelectedPack(null);
    setReceivedCards([]);
    setModalError("");
  }

  useEffect(() => {
    if (user) {
      loadPacks(user.uid);
    }

    if (!isAuthLoading && !user) {
      setIsLoadingPacks(false);
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || isLoadingPacks) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Carregando pacotes...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Entre para ver seus pacotes</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Os pacotes são vinculados à sua conta. Faça login para visualizar
            os pacotes liberados pelo Ravel.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Entrar
          </Link>
        </section>
      </main>
    );
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
              Pacotes reais liberados pelo Ravel para sua conta.
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
              {grantedPacks.length}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Pacotes disponíveis
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Abra os pacotes liberados para sua conta.
            </p>
          </div>

          {availablePacks.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
              <h3 className="text-2xl font-black text-white">
                Nenhum pacote disponível
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Quando o Ravel liberar um pacote para você, ele aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availablePacks.map((pack) => (
                <RealPackCard
                  key={pack.id}
                  grantedPack={pack}
                  onOpen={handleOpenPack}
                  isOpening={isOpening}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Histórico de pacotes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pacotes já abertos.
            </p>
          </div>

          {openedPacks.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
              <h3 className="text-2xl font-black text-white">
                Nenhum pacote aberto ainda
              </h3>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {openedPacks.map((pack) => (
                <RealPackCard
                  key={pack.id}
                  grantedPack={pack}
                  onOpen={handleOpenPack}
                  isOpening={isOpening}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <RealOpenPackModal
        pack={selectedPack}
        cards={receivedCards}
        error={modalError}
        onClose={handleCloseModal}
      />
    </main>
  );
}
```

---

## 13. Atualizar `/admin/liberar-pacote` para salvar no Firestore

Substitua o conteúdo de:

```txt
app/admin/liberar-pacote/page.tsx
```

Por:

```tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listActivePacks } from "@/services/packs-service";
import { grantPackToUser } from "@/services/granted-packs-service";
import { PackDocument } from "@/types/database";
import { adminUsers } from "@/lib/admin-mock-data";

export default function AdminGrantPackPage() {
  const { user } = useAuthUser();

  const [packs, setPacks] = useState<PackDocument[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPackId, setSelectedPackId] = useState("");
  const [reason, setReason] = useState<
    "live_purchase" | "event_reward" | "manual_bonus" | "admin"
  >("live_purchase");
  const [message, setMessage] = useState("");

  async function loadPacks() {
    const activePacks = await listActivePacks();

    setPacks(activePacks);

    if (activePacks.length > 0) {
      setSelectedPackId(activePacks[0].id);
    }

    if (adminUsers.length > 0) {
      setSelectedUserId(adminUsers[0].id);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setMessage("");

      if (!user) {
        setMessage("Você precisa estar logado para liberar pacote.");
        return;
      }

      if (!selectedUserId || !selectedPackId) {
        setMessage("Selecione usuário e pacote.");
        return;
      }

      await grantPackToUser({
        userId: selectedUserId,
        packId: selectedPackId,
        reason,
        grantedBy: user.uid,
      });

      setMessage("Pacote liberado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao liberar pacote.");
    }
  }

  useEffect(() => {
    loadPacks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Liberar pacote"
        description="Libere um pacote real para um usuário. O pacote aparecerá na tela /pacotes do usuário selecionado."
      />

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Usuário
            </label>

            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              {adminUsers.map((adminUser) => (
                <option key={adminUser.id} value={adminUser.id}>
                  {adminUser.displayName} (@{adminUser.username})
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-yellow-300">
              Atenção: nesta versão, a lista de usuários ainda está mockada. Para
              testar com sua conta real, troque o id do usuário no mock pelo UID
              criado no Firebase Authentication.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Pacote
            </label>

            <select
              value={selectedPackId}
              onChange={(event) => setSelectedPackId(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} - {pack.cardsQuantity} cartas
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Motivo da liberação
            </label>

            <select
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value as
                    | "live_purchase"
                    | "event_reward"
                    | "manual_bonus"
                    | "admin"
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              <option value="live_purchase">Compra/combinação na live</option>
              <option value="event_reward">Recompensa de evento</option>
              <option value="manual_bonus">Bônus manual</option>
              <option value="admin">Ajuste admin</option>
            </select>
          </div>

          {message && (
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Liberar pacote
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
```

---

## 14. Criar página de seed para cartas e pacotes

Crie:

```txt
app/admin/seed-packs/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useState } from "react";
import { createCard } from "@/services/cards-service";
import { createPack } from "@/services/packs-service";

export default function SeedPacksPage() {
  const [message, setMessage] = useState("");

  async function handleSeedCardsAndPacks() {
    try {
      setMessage("Criando cartas e pacotes...");

      await createCard({
        id: "card-duck-junkrat",
        name: "Pato Junkrat",
        description:
          "Desbloqueia o Pato Junkrat ou futuramente vira XP se for duplicado.",
        type: "duck",
        rarity: "epic",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-xp-junkrat",
        name: "XP Junkrat +100",
        description: "Adiciona 100 XP ao Pato Junkrat.",
        type: "duck_xp",
        rarity: "rare",
        duckId: "duck-junkrat",
        xpAmount: 100,
      });

      await createCard({
        id: "card-border-junkrat",
        name: "Borda Junkrat",
        description: "Borda temática para o perfil.",
        type: "border",
        rarity: "rare",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-pin-junkrat",
        name: "Pin Junkrat",
        description: "Pin colecionável do Pato Junkrat.",
        type: "pin",
        rarity: "common",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-ravelbox",
        name: "Ravelbox",
        description: "Recompensa especial que ficará pendente para entrega.",
        type: "ravelbox",
        rarity: "legendary",
      });

      await createCard({
        id: "card-duck-king",
        name: "Pato Rei",
        description: "Desbloqueia o Pato Rei.",
        type: "duck",
        rarity: "legendary",
        duckId: "duck-king",
      });

      await createPack({
        id: "pack-live",
        name: "Pacote da Live",
        description: "Pacote liberado durante a live do Ravel.",
        cardsQuantity: 4,
        cardPool: [
          "card-duck-junkrat",
          "card-xp-junkrat",
          "card-border-junkrat",
          "card-pin-junkrat",
          "card-ravelbox",
          "card-duck-king",
        ],
      });

      await createPack({
        id: "pack-event",
        name: "Pacote Evento Especial",
        description: "Pacote usado em eventos e recompensas especiais.",
        cardsQuantity: 3,
        cardPool: [
          "card-duck-junkrat",
          "card-xp-junkrat",
          "card-border-junkrat",
          "card-ravelbox",
        ],
      });

      setMessage("Cartas e pacotes criados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar cartas e pacotes.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Cartas e pacotes</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela apenas em desenvolvimento para criar cartas e pacotes
          iniciais no Firestore.
        </p>

        <button
          onClick={handleSeedCardsAndPacks}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar cartas e pacotes
        </button>

        {message && (
          <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
```

---

## 15. Ajuste importante para testar com usuário real

Na página `/admin/liberar-pacote`, por enquanto a lista de usuários ainda vem de:

```txt
lib/admin-mock-data.ts
```

Para testar com seu usuário real, você precisa editar temporariamente o `id` do usuário no mock.

Abra:

```txt
lib/admin-mock-data.ts
```

Procure:

```ts
export const adminUsers: AdminUser[] = [
  {
    id: "user-ravel",
    username: "ravel",
    displayName: "Ravel",
    totalDucks: 7,
    availablePacks: 1,
  },
```

Troque o `id` para o UID real do usuário criado no Firebase Authentication.

Exemplo:

```ts
{
  id: "UID_REAL_DO_FIREBASE",
  username: "guilherme",
  displayName: "Guilherme",
  totalDucks: 0,
  availablePacks: 0,
}
```

Você encontra o UID no Firebase Console:

```txt
Authentication
    ↓
Users
    ↓
User UID
```

---

## 16. Fluxo de teste da Etapa 8

Siga esta ordem:

### 1. Criar conta

Acesse:

```txt
http://localhost:3000/cadastro
```

Crie um usuário.

### 2. Fazer login

Acesse:

```txt
http://localhost:3000/login
```

Entre com o usuário criado.

### 3. Criar patos iniciais

Acesse:

```txt
http://localhost:3000/admin/seed
```

Clique em:

```txt
Criar patos iniciais
```

### 4. Criar cartas e pacotes

Acesse:

```txt
http://localhost:3000/admin/seed-packs
```

Clique em:

```txt
Criar cartas e pacotes
```

### 5. Ajustar o UID no mock de adminUsers

No arquivo:

```txt
lib/admin-mock-data.ts
```

Troque o `id` do usuário mockado pelo UID real do usuário do Firebase.

### 6. Liberar pacote

Acesse:

```txt
http://localhost:3000/admin/liberar-pacote
```

Selecione:

```txt
Usuário real
Pacote da Live
Motivo
```

Clique em:

```txt
Liberar pacote
```

### 7. Ver pacote do usuário

Acesse:

```txt
http://localhost:3000/pacotes
```

Você deve ver o pacote liberado.

### 8. Abrir pacote

Clique em:

```txt
Abrir pacote
```

O sistema deve:

```txt
sortear cartas
mostrar o modal
criar packOpenings
marcar grantedPacks como opened
```

### 9. Conferir no Firebase Console

Veja se foram criados documentos em:

```txt
grantedPacks
packOpenings
```

E se o status do pacote liberado virou:

```txt
opened
```

---

## 17. Erro comum: índice composto do Firestore

A consulta em `listGrantedPacksByUser` usa:

```ts
where("userId", "==", userId),
orderBy("createdAt", "desc")
```

O Firestore pode pedir um índice composto.

Se aparecer erro no console, ele normalmente fornece um link direto para criar o índice.

Basta clicar no link, criar o índice e aguardar alguns minutos.

---

## 18. Erro comum: permissão insuficiente

Se aparecer:

```txt
Missing or insufficient permissions
```

Verifique as regras do Firestore.

Durante desenvolvimento, use temporariamente:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Depois vamos restringir melhor.

---

## 19. O que essa etapa entrega

Ao final da Etapa 8, você terá:

```txt
Pacotes reais no Firestore
Cartas reais no Firestore
Admin liberando pacote real para usuário
Usuário vendo pacotes reais em /pacotes
Usuário abrindo pacote real
Cartas sorteadas do cardPool
Histórico salvo em packOpenings
Pacote liberado atualizado para opened
Modal mostrando cartas reais recebidas
```

---

## 20. Limitações desta etapa

Ainda não teremos:

```txt
cartas entrando na coleção real
duplicata virando XP real
pato novo criando userDucks
Ravelbox criando pendingRewards
adminUsers carregando do Firestore
proteção real de rota admin
controle de raridade ponderada
```

Essas partes entram nas próximas etapas.

---

## 21. Próxima etapa

A próxima etapa será:

```txt
Etapa 9 — Aplicar resultado da abertura na coleção
```

Nela vamos implementar:

```txt
se carta for pato novo, cria userDucks
se carta for pato repetido, adiciona XP
se carta for duck_xp, adiciona XP ao pato
se subir de nível, libera recompensa
se recompensa for Ravelbox, cria pendingRewards
se carta for item, adiciona ao inventário
```
