# Etapa 9 — Aplicar resultado da abertura na coleção

Nesta etapa vamos transformar as cartas recebidas na abertura de pacotes em **progresso real do usuário**.

Na Etapa 8, o sistema já passou a:

```txt
admin liberar pacote real
usuário ver pacote real em /pacotes
usuário abrir pacote real
sistema sortear cartas reais
salvar histórico em packOpenings
marcar pacote como opened
```

Agora vamos fazer o próximo passo:

```txt
cartas abertas
        ↓
entram na coleção
        ↓
pato novo é desbloqueado
        ↓
pato repetido vira XP
        ↓
carta de XP aumenta XP
        ↓
pato sobe de nível
        ↓
recompensas são liberadas
        ↓
Ravelbox vira recompensa pendente
```

---

## 1. Objetivo da etapa

Implementar a lógica real de aplicação das cartas recebidas na coleção do usuário.

Nesta etapa vamos criar:

- serviço de `userDucks`;
- serviço de trilhas de recompensa dos patos;
- serviço de recompensas pendentes;
- lógica de XP por pato;
- lógica de level up;
- lógica de desbloqueio de recompensa;
- lógica de Ravelbox pendente;
- atualização da função de abertura de pacotes;
- tela `/colecao` buscando dados reais;
- tela `/patos/[duckId]` buscando progresso real do usuário.

---

## 2. O que será implementado

Quando o usuário abrir um pacote, cada carta será processada.

### Carta do tipo `duck`

Se o usuário ainda não tem o pato:

```txt
cria userDucks
nível 1
XP 0
libera recompensa nível 1
```

Se o usuário já tem o pato:

```txt
converte duplicata em XP
adiciona XP ao pato
verifica se subiu de nível
libera recompensas
```

### Carta do tipo `duck_xp`

Se a carta tiver `duckId`:

```txt
adiciona XP ao pato específico
```

Se o usuário ainda não tiver esse pato:

```txt
cria o pato no nível 1
aplica XP
```

### Carta do tipo `ravelbox`

Cria um documento em:

```txt
pendingRewards
```

### Cartas de cosméticos

Por enquanto, nesta etapa, vamos registrar a lógica principal, mas o inventário de itens será refinado depois.

Tipos como:

```txt
border
pin
island_item
digital_art
accessory
```

podem futuramente entrar em uma coleção `userItems`.

Nesta etapa, podemos tratar como recompensa visual futura.

---

## 3. Coleções do Firestore usadas

Vamos usar:

```txt
cards
ducks
duckRewards
userDucks
pendingRewards
packOpenings
grantedPacks
```

### `userDucks`

Representa o pato que o usuário possui.

Exemplo:

```ts
{
  id: "UID_duck-junkrat",
  userId: "UID",
  duckId: "duck-junkrat",
  level: 4,
  xp: 430,
  unlockedRewards: ["reward-junkrat-1", "reward-junkrat-2"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `duckRewards`

Representa a trilha de recompensa de cada pato.

Exemplo:

```ts
{
  id: "reward-junkrat-6",
  duckId: "duck-junkrat",
  level: 6,
  name: "Ravelbox",
  type: "ravelbox",
  description: "Uma Ravelbox especial.",
  active: true
}
```

### `pendingRewards`

Representa recompensas que o Ravel precisa entregar.

Exemplo:

```ts
{
  id: "pending-001",
  userId: "UID",
  rewardType: "ravelbox",
  rewardName: "Ravelbox",
  source: "duck_level",
  sourceId: "reward-junkrat-6",
  status: "pending",
  createdAt: Timestamp
}
```

---

## 4. Estrutura de arquivos

Crie ou atualize:

```txt
services/
  user-ducks-service.ts
  duck-rewards-service.ts
  pending-rewards-service.ts
  pack-results-service.ts
  pack-openings-service.ts

app/
  admin/
    seed-rewards/
      page.tsx
  colecao/
    page.tsx
  patos/
    [duckId]/
      page.tsx

components/
  collection/
    RealDuckCollectionCard.tsx
    RealDuckCollectionGrid.tsx

types/
  database.ts
```

---

## 5. Atualizar tipos em `types/database.ts`

Abra:

```txt
types/database.ts
```

Confirme se estes tipos existem. Se não existirem, adicione:

```ts
export type UserRole = "user" | "admin";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type CardType =
  | "duck"
  | "duck_xp"
  | "island_item"
  | "accessory"
  | "border"
  | "pin"
  | "digital_art"
  | "ravelbox";

export type RewardType =
  | CardType
  | "skin";

export type PendingRewardStatus = "pending" | "delivered" | "cancelled";

export interface UserDuckDocument {
  id: string;
  userId: string;
  duckId: string;
  level: number;
  xp: number;
  unlockedRewards: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DuckRewardDocument {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: RewardType;
  description: string;
  imageUrl?: string;
  active: boolean;
}

export interface PendingRewardDocument {
  id: string;
  userId: string;
  rewardType: "ravelbox" | "external_reward";
  rewardName: string;
  source: "duck_level" | "collection_milestone" | "event" | "admin";
  sourceId?: string;
  status: PendingRewardStatus;
  createdAt: Date;
  deliveredAt?: Date;
}

export interface CollectionDuckView {
  userDuck: UserDuckDocument;
  duck: DuckDocument;
  rewards: DuckRewardDocument[];
}
```

---

## 6. Criar regra de XP por nível

Para esta etapa, vamos usar uma regra simples.

Crie o arquivo:

```txt
lib/leveling.ts
```

Com o conteúdo:

```ts
export const MAX_DUCK_LEVEL = 10;

export function getRequiredXpForLevel(level: number) {
  const xpByLevel: Record<number, number> = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 800,
    6: 1200,
    7: 1700,
    8: 2300,
    9: 3000,
    10: 4000,
  };

  return xpByLevel[level] ?? 4000;
}

export function calculateLevelFromXp(totalXp: number) {
  let level = 1;

  for (let currentLevel = 2; currentLevel <= MAX_DUCK_LEVEL; currentLevel++) {
    if (totalXp >= getRequiredXpForLevel(currentLevel)) {
      level = currentLevel;
    }
  }

  return level;
}

export function getXpToNextLevel(currentLevel: number, totalXp: number) {
  if (currentLevel >= MAX_DUCK_LEVEL) {
    return {
      currentLevelXp: totalXp,
      nextLevelXp: totalXp,
      percentage: 100,
    };
  }

  const currentLevelRequiredXp = getRequiredXpForLevel(currentLevel);
  const nextLevelRequiredXp = getRequiredXpForLevel(currentLevel + 1);

  const currentLevelXp = Math.max(totalXp - currentLevelRequiredXp, 0);
  const nextLevelXp = nextLevelRequiredXp - currentLevelRequiredXp;

  return {
    currentLevelXp,
    nextLevelXp,
    percentage: Math.min((currentLevelXp / nextLevelXp) * 100, 100),
  };
}
```

---

## 7. Criar serviço de recompensas dos patos

Crie:

```txt
services/duck-rewards-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { DuckRewardDocument, RewardType } from "@/types/database";

interface CreateDuckRewardInput {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: RewardType;
  description: string;
  imageUrl?: string;
}

export async function createDuckReward(input: CreateDuckRewardInput) {
  const rewardRef = doc(db, "duckRewards", input.id);

  await setDoc(rewardRef, {
    ...input,
    active: true,
  });
}

export async function listRewardsByDuckId(duckId: string) {
  const rewardsRef = collection(db, "duckRewards");

  const rewardsQuery = query(
    rewardsRef,
    where("duckId", "==", duckId),
    where("active", "==", true)
  );

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs
    .map((rewardDocument) => {
      const data = rewardDocument.data();

      return {
        ...data,
        id: rewardDocument.id,
      } as DuckRewardDocument;
    })
    .sort((a, b) => a.level - b.level);
}

export async function listRewardsUnlockedByLevel(
  duckId: string,
  level: number
) {
  const rewards = await listRewardsByDuckId(duckId);

  return rewards.filter((reward) => reward.level <= level);
}
```

---

## 8. Criar serviço de recompensas pendentes

Crie:

```txt
services/pending-rewards-service.ts
```

Com o conteúdo:

```ts
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface CreatePendingRewardInput {
  userId: string;
  rewardName: string;
  source: "duck_level" | "collection_milestone" | "event" | "admin";
  sourceId?: string;
}

export async function createPendingRavelbox(input: CreatePendingRewardInput) {
  const rewardRef = doc(collection(db, "pendingRewards"));

  await setDoc(rewardRef, {
    id: rewardRef.id,
    userId: input.userId,
    rewardType: "ravelbox",
    rewardName: input.rewardName,
    source: input.source,
    sourceId: input.sourceId,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return rewardRef.id;
}
```

---

## 9. Criar serviço de patos do usuário

Crie:

```txt
services/user-ducks-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  CollectionDuckView,
  DuckDocument,
  UserDuckDocument,
} from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { calculateLevelFromXp } from "@/lib/leveling";
import { getDuckById } from "./ducks-service";
import { listRewardsByDuckId } from "./duck-rewards-service";

export function makeUserDuckId(userId: string, duckId: string) {
  return `${userId}_${duckId}`;
}

export async function getUserDuck(userId: string, duckId: string) {
  const userDuckId = makeUserDuckId(userId, duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);
  const snapshot = await getDoc(userDuckRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as UserDuckDocument;
}

export async function unlockOrAddXpToDuck(input: {
  userId: string;
  duckId: string;
  xpToAdd: number;
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  const result = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      const initialXp = Math.max(input.xpToAdd, 0);
      const level = calculateLevelFromXp(initialXp);

      transaction.set(userDuckRef, {
        id: userDuckId,
        userId: input.userId,
        duckId: input.duckId,
        level,
        xp: initialXp,
        unlockedRewards: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        wasCreated: true,
        previousLevel: 0,
        newLevel: level,
        newXp: initialXp,
      };
    }

    const data = snapshot.data() as UserDuckDocument;
    const newXp = (data.xp ?? 0) + input.xpToAdd;
    const newLevel = calculateLevelFromXp(newXp);

    transaction.update(userDuckRef, {
      xp: newXp,
      level: newLevel,
      updatedAt: serverTimestamp(),
    });

    return {
      wasCreated: false,
      previousLevel: data.level,
      newLevel,
      newXp,
    };
  });

  return result;
}

export async function updateUnlockedRewards(input: {
  userId: string;
  duckId: string;
  rewardIds: string[];
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      return;
    }

    const data = snapshot.data() as UserDuckDocument;

    const mergedRewards = Array.from(
      new Set([...(data.unlockedRewards ?? []), ...input.rewardIds])
    );

    transaction.update(userDuckRef, {
      unlockedRewards: mergedRewards,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function listUserDucks(userId: string) {
  const userDucksRef = collection(db, "userDucks");
  const userDucksQuery = query(userDucksRef, where("userId", "==", userId));

  const snapshot = await getDocs(userDucksQuery);

  return snapshot.docs.map((userDuckDocument) => {
    const data = userDuckDocument.data();

    return {
      ...data,
      id: userDuckDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as UserDuckDocument;
  });
}

export async function listUserCollection(userId: string) {
  const userDucks = await listUserDucks(userId);

  const collection = await Promise.all(
    userDucks.map(async (userDuck) => {
      const duck = await getDuckById(userDuck.duckId);
      const rewards = await listRewardsByDuckId(userDuck.duckId);

      if (!duck) {
        return null;
      }

      return {
        userDuck,
        duck: duck as DuckDocument,
        rewards,
      } as CollectionDuckView;
    })
  );

  return collection.filter(
    (item): item is CollectionDuckView => Boolean(item)
  );
}
```

---

## 10. Atualizar serviço `ducks-service.ts`

Abra:

```txt
services/ducks-service.ts
```

Adicione a função:

```ts
import { doc, getDoc } from "firebase/firestore";
import { DuckDocument } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
```

Se esses imports já existirem, não duplique.

Depois adicione a função:

```ts
export async function getDuckById(duckId: string) {
  const duckRef = doc(db, "ducks", duckId);
  const snapshot = await getDoc(duckRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as DuckDocument;
}
```

Atenção: se seu arquivo já importa `doc` ou `getDoc`, apenas inclua no import existente.

---

## 11. Criar serviço para aplicar resultado do pacote

Crie:

```txt
services/pack-results-service.ts
```

Com o conteúdo:

```ts
import { CardDocument } from "@/types/database";
import { unlockOrAddXpToDuck, updateUnlockedRewards } from "./user-ducks-service";
import { listRewardsUnlockedByLevel } from "./duck-rewards-service";
import { createPendingRavelbox } from "./pending-rewards-service";

const DUPLICATE_DUCK_XP = 100;

interface ApplyPackResultInput {
  userId: string;
  cards: CardDocument[];
}

export async function applyPackResultToCollection(input: ApplyPackResultInput) {
  const messages: string[] = [];

  for (const card of input.cards) {
    if (card.type === "duck" && card.duckId) {
      const result = await unlockOrAddXpToDuck({
        userId: input.userId,
        duckId: card.duckId,
        xpToAdd: resultXpForDuckCard(resultWasDuplicate(card)),
      });

      await unlockRewardsForDuck({
        userId: input.userId,
        duckId: card.duckId,
        level: result.newLevel,
      });

      if (result.wasCreated) {
        messages.push(`${card.name} desbloqueado.`);
      } else {
        messages.push(`${card.name} duplicado: +${DUPLICATE_DUCK_XP} XP.`);
      }
    }

    if (card.type === "duck_xp" && card.duckId) {
      const xpToAdd = card.xpAmount ?? 0;

      const result = await unlockOrAddXpToDuck({
        userId: input.userId,
        duckId: card.duckId,
        xpToAdd,
      });

      await unlockRewardsForDuck({
        userId: input.userId,
        duckId: card.duckId,
        level: result.newLevel,
      });

      messages.push(`${card.name}: +${xpToAdd} XP.`);
    }

    if (card.type === "ravelbox") {
      await createPendingRavelbox({
        userId: input.userId,
        rewardName: card.name,
        source: "event",
        sourceId: card.id,
      });

      messages.push(`${card.name} adicionada como recompensa pendente.`);
    }
  }

  return {
    messages,
  };
}

function resultWasDuplicate(card: CardDocument) {
  // Nesta etapa, a verificação real de duplicata acontece dentro de unlockOrAddXpToDuck.
  // Para simplificar, carta do tipo duck sempre pode gerar desbloqueio ou XP.
  return Boolean(card);
}

function resultXpForDuckCard(_isDuplicate: boolean) {
  return DUPLICATE_DUCK_XP;
}

async function unlockRewardsForDuck(input: {
  userId: string;
  duckId: string;
  level: number;
}) {
  const unlockedRewards = await listRewardsUnlockedByLevel(
    input.duckId,
    input.level
  );

  await updateUnlockedRewards({
    userId: input.userId,
    duckId: input.duckId,
    rewardIds: unlockedRewards.map((reward) => reward.id),
  });

  const ravelboxRewards = unlockedRewards.filter(
    (reward) => reward.type === "ravelbox"
  );

  for (const reward of ravelboxRewards) {
    await createPendingRavelbox({
      userId: input.userId,
      rewardName: reward.name,
      source: "duck_level",
      sourceId: reward.id,
    });
  }
}
```

### Observação importante sobre duplicata

O código acima adiciona XP até quando o pato é criado pela primeira vez.

Se você quiser que o primeiro desbloqueio venha com XP 0, substitua o bloco do tipo `duck` por uma versão mais controlada depois.

Uma versão mais refinada será feita quando ajustarmos regras de balanceamento.

---

## 12. Melhorar a lógica para não dar XP no primeiro desbloqueio

A versão mais correta para o tipo `duck` é:

```txt
se não existe userDuck:
  cria com XP 0
se já existe:
  adiciona XP de duplicata
```

Para isso, substitua a função `unlockOrAddXpToDuck` por esta versão:

```ts
export async function unlockDuckOrConvertDuplicateToXp(input: {
  userId: string;
  duckId: string;
  duplicateXp: number;
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  const result = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      transaction.set(userDuckRef, {
        id: userDuckId,
        userId: input.userId,
        duckId: input.duckId,
        level: 1,
        xp: 0,
        unlockedRewards: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        wasCreated: true,
        previousLevel: 0,
        newLevel: 1,
        newXp: 0,
      };
    }

    const data = snapshot.data() as UserDuckDocument;
    const newXp = (data.xp ?? 0) + input.duplicateXp;
    const newLevel = calculateLevelFromXp(newXp);

    transaction.update(userDuckRef, {
      xp: newXp,
      level: newLevel,
      updatedAt: serverTimestamp(),
    });

    return {
      wasCreated: false,
      previousLevel: data.level,
      newLevel,
      newXp,
    };
  });

  return result;
}
```

Depois, no arquivo `pack-results-service.ts`, importe essa função e altere o bloco do tipo `duck`:

```ts
import {
  unlockDuckOrConvertDuplicateToXp,
  unlockOrAddXpToDuck,
  updateUnlockedRewards,
} from "./user-ducks-service";
```

E use:

```ts
if (card.type === "duck" && card.duckId) {
  const result = await unlockDuckOrConvertDuplicateToXp({
    userId: input.userId,
    duckId: card.duckId,
    duplicateXp: DUPLICATE_DUCK_XP,
  });

  await unlockRewardsForDuck({
    userId: input.userId,
    duckId: card.duckId,
    level: result.newLevel,
  });

  if (result.wasCreated) {
    messages.push(`${card.name} desbloqueado.`);
  } else {
    messages.push(`${card.name} duplicado: +${DUPLICATE_DUCK_XP} XP.`);
  }
}
```

Essa é a versão recomendada.

---

## 13. Atualizar `pack-openings-service.ts`

Agora precisamos aplicar o resultado na coleção depois que o pacote é aberto.

Abra:

```txt
services/pack-openings-service.ts
```

Adicione o import:

```ts
import { applyPackResultToCollection } from "./pack-results-service";
```

Depois, no final da função `openGrantedPack`, após buscar as cartas, ajuste o retorno.

Procure algo parecido com:

```ts
const cards = await getCardsByIds(result.cardIds);

return {
  openingId: result.openingId,
  cards: cards as CardDocument[],
};
```

Substitua por:

```ts
const cards = await getCardsByIds(result.cardIds);

const applicationResult = await applyPackResultToCollection({
  userId: input.userId,
  cards,
});

return {
  openingId: result.openingId,
  cards: cards as CardDocument[],
  messages: applicationResult.messages,
};
```

Agora, a abertura do pacote já atualiza a coleção.

---

## 14. Ajustar tela `/pacotes` para mostrar mensagens do resultado

Abra:

```txt
app/pacotes/page.tsx
```

Adicione um estado:

```ts
const [resultMessages, setResultMessages] = useState<string[]>([]);
```

Na função `handleOpenPack`, procure:

```ts
setReceivedCards(result.cards);
```

Logo abaixo, adicione:

```ts
setResultMessages(result.messages ?? []);
```

Na função `handleCloseModal`, adicione:

```ts
setResultMessages([]);
```

Agora precisamos passar as mensagens para o modal.

Atualize `RealOpenPackModal`.

---

## 15. Atualizar `RealOpenPackModal`

Abra:

```txt
components/packs/RealOpenPackModal.tsx
```

Adicione a prop:

```ts
messages?: string[];
```

A interface fica assim:

```ts
interface RealOpenPackModalProps {
  pack: ResolvedGrantedPack | null;
  cards: CardDocument[];
  messages?: string[];
  error?: string;
  onClose: () => void;
}
```

No componente, receba `messages`:

```ts
export function RealOpenPackModal({
  pack,
  cards,
  messages = [],
  error,
  onClose,
}: RealOpenPackModalProps) {
```

Depois da lista de cards, adicione:

```tsx
{messages.length > 0 && (
  <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
    <p className="text-sm font-black text-emerald-300">
      Resultado aplicado na coleção:
    </p>

    <ul className="mt-3 grid gap-2 text-sm text-emerald-100">
      {messages.map((message) => (
        <li key={message}>• {message}</li>
      ))}
    </ul>
  </div>
)}
```

Na chamada do modal em `/pacotes`, passe:

```tsx
<RealOpenPackModal
  pack={selectedPack}
  cards={receivedCards}
  messages={resultMessages}
  error={modalError}
  onClose={handleCloseModal}
/>
```

---

## 16. Criar seed das recompensas do Pato Junkrat

Crie:

```txt
app/admin/seed-rewards/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useState } from "react";
import { createDuckReward } from "@/services/duck-rewards-service";

export default function SeedRewardsPage() {
  const [message, setMessage] = useState("");

  async function handleSeedRewards() {
    try {
      setMessage("Criando recompensas...");

      const rewards = [
        {
          id: "reward-junkrat-1",
          duckId: "duck-junkrat",
          level: 1,
          name: "Pato Junkrat",
          type: "duck" as const,
          description: "Desbloqueia o Pato Junkrat na coleção.",
        },
        {
          id: "reward-junkrat-2",
          duckId: "duck-junkrat",
          level: 2,
          name: "Borda temática Junkrat",
          type: "border" as const,
          description: "Uma borda temática para destacar o perfil.",
        },
        {
          id: "reward-junkrat-3",
          duckId: "duck-junkrat",
          level: 3,
          name: "Pin Junkrat",
          type: "pin" as const,
          description: "Um pin colecionável do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-4",
          duckId: "duck-junkrat",
          level: 4,
          name: "Acessório Junkrat na ilha",
          type: "island_item" as const,
          description: "Um acessório temático para decorar a ilha.",
        },
        {
          id: "reward-junkrat-5",
          duckId: "duck-junkrat",
          level: 5,
          name: "Arte digital HD",
          type: "digital_art" as const,
          description: "Arte digital em alta definição do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-6",
          duckId: "duck-junkrat",
          level: 6,
          name: "Ravelbox",
          type: "ravelbox" as const,
          description: "Uma Ravelbox como recompensa especial.",
        },
        {
          id: "reward-junkrat-7",
          duckId: "duck-junkrat",
          level: 7,
          name: "Acessório lendário de ilha",
          type: "island_item" as const,
          description: "Um item visual mais raro para a ilha.",
        },
        {
          id: "reward-junkrat-8",
          duckId: "duck-junkrat",
          level: 8,
          name: "Junkrat Rei",
          type: "skin" as const,
          description: "Visual evoluído do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-9",
          duckId: "duck-junkrat",
          level: 9,
          name: "Borda lendária",
          type: "border" as const,
          description: "Uma borda lendária para o perfil.",
        },
        {
          id: "reward-junkrat-10",
          duckId: "duck-junkrat",
          level: 10,
          name: "Ravelbox Final",
          type: "ravelbox" as const,
          description: "Recompensa final da trilha do Pato Junkrat.",
        },
      ];

      for (const reward of rewards) {
        await createDuckReward(reward);
      }

      setMessage("Recompensas criadas com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar recompensas.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Recompensas</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela em desenvolvimento para criar a trilha de recompensas do
          Pato Junkrat.
        </p>

        <button
          onClick={handleSeedRewards}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar recompensas
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

## 17. Migrar `/colecao` para dados reais

Nesta etapa, a coleção pode começar a ler `userDucks` reais.

Substitua:

```txt
app/colecao/page.tsx
```

por:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listUserCollection } from "@/services/user-ducks-service";
import { CollectionDuckView } from "@/types/database";
import { getXpToNextLevel } from "@/lib/leveling";

export default function CollectionPage() {
  const { user, isLoading } = useAuthUser();

  const [collection, setCollection] = useState<CollectionDuckView[]>([]);
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);

  async function loadCollection(userId: string) {
    try {
      setIsLoadingCollection(true);

      const data = await listUserCollection(userId);

      setCollection(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCollection(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadCollection(user.uid);
    }

    if (!isLoading && !user) {
      setIsLoadingCollection(false);
    }
  }, [user, isLoading]);

  if (isLoading || isLoadingCollection) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Carregando coleção...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Entre para ver sua coleção</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Sua coleção é vinculada à sua conta.
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
              Minha coleção
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Patinhos reais desbloqueados a partir dos pacotes abertos.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pacotes"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Abrir pacotes
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {collection.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {collection.reduce(
                (acc, item) => acc + item.userDuck.unlockedRewards.length,
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Maior nível
            </p>
            <p className="mt-2 text-3xl font-black text-yellow-400">
              {collection.length > 0
                ? Math.max(...collection.map((item) => item.userDuck.level))
                : 0}
            </p>
          </div>
        </section>

        {collection.length === 0 ? (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-xl">
            <h2 className="text-3xl font-black text-white">
              Nenhum pato desbloqueado ainda
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Abra pacotes para começar sua coleção.
            </p>

            <Link
              href="/pacotes"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver pacotes
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {collection.map((item) => {
              const xpInfo = getXpToNextLevel(
                item.userDuck.level,
                item.userDuck.xp
              );

              return (
                <article
                  key={item.userDuck.id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
                >
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-6xl shadow-xl">
                      🦆
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black text-white">
                      {item.duck.name}
                    </h2>

                    <p className="text-sm text-zinc-500">
                      Tema: {item.duck.theme}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-zinc-200">
                          Nível {item.userDuck.level}/{item.duck.maxLevel}
                        </span>

                        <span className="text-zinc-500">
                          {xpInfo.currentLevelXp}/{xpInfo.nextLevelXp} XP
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-yellow-400"
                          style={{ width: `${xpInfo.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm text-zinc-400">
                        Recompensas liberadas:{" "}
                        <strong className="text-white">
                          {item.userDuck.unlockedRewards.length}
                        </strong>
                      </p>
                    </div>

                    <Link
                      href={`/patos/${item.duck.id}`}
                      className="mt-6 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
                    >
                      Ver progresso
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
```

---

## 18. Fluxo de teste da Etapa 9

Siga esta ordem:

### 1. Rodar seeds anteriores

Acesse:

```txt
/admin/seed
/admin/seed-packs
```

### 2. Criar recompensas

Acesse:

```txt
/admin/seed-rewards
```

Clique em:

```txt
Criar recompensas
```

### 3. Liberar pacote

Acesse:

```txt
/admin/liberar-pacote
```

Libere um pacote para seu usuário real.

### 4. Abrir pacote

Acesse:

```txt
/pacotes
```

Abra o pacote.

### 5. Ver resultado

No modal, veja as mensagens:

```txt
Pato Junkrat desbloqueado.
XP Junkrat +100: +100 XP.
Ravelbox adicionada como recompensa pendente.
```

### 6. Ver coleção real

Acesse:

```txt
/colecao
```

O pato aberto deve aparecer na coleção.

### 7. Conferir no Firebase

Verifique as coleções:

```txt
userDucks
pendingRewards
packOpenings
grantedPacks
```

---

## 19. Possíveis erros

### Erro: `getDuckById` não encontrado

Verifique se você adicionou a função em:

```txt
services/ducks-service.ts
```

### Erro: permissão insuficiente

Use temporariamente regra de desenvolvimento:

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

### Coleção aparece vazia

Verifique:

```txt
se abriu pacote logado
se userDucks foi criado
se ducks existem no Firestore
se duckId da carta bate com id do duck
```

### Ravelbox duplicada

Como a lógica ainda é simples, abrir várias cartas que liberam a mesma Ravelbox pode criar duplicatas em `pendingRewards`.

Isso será refinado depois.

---

## 20. O que essa etapa entrega

Ao final da Etapa 9, você terá:

```txt
cartas de pacote aplicadas na coleção real
pato novo criando userDucks
pato duplicado virando XP
carta XP aumentando XP
nível calculado automaticamente
recompensas desbloqueadas por nível
Ravelbox criando pendingRewards
coleção lendo dados reais
mensagens de resultado no modal de abertura
```

---

## 21. Limitações desta etapa

Ainda teremos:

```txt
inventário de itens visuais não implementado
itens de ilha não equipáveis
Ravelbox pode duplicar
admin de Ravelbox ainda precisa buscar dados reais
página /patos/[duckId] ainda pode precisar ser migrada para dados reais
overlay ainda mockado
```

---

## 22. Próxima etapa

Depois desta etapa, podemos seguir para uma das duas direções:

### Opção A — Etapa 10: Overlay para live

Se ainda não tiver implementado, cria a tela visual para OBS.

### Opção B — Etapa 11: Conectar overlay com eventos reais

Se a Etapa 10 já foi implementada, o próximo passo é criar eventos reais:

```txt
liveEvents
```

Para que quando o usuário abrir pacote, desbloquear pato, subir nível ou ganhar Ravelbox, o overlay mostre o evento automaticamente.
