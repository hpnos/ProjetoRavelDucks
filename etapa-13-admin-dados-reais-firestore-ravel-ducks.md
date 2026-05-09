# Etapa 13 — Migrar painel admin para dados reais do Firestore

Nesta etapa vamos tirar o painel admin dos dados mockados e conectar as principais telas administrativas ao Firestore.

Até agora, algumas páginas do admin ainda usam dados de:

```txt
lib/admin-mock-data.ts
```

Agora vamos começar a usar dados reais das coleções:

```txt
users
ducks
cards
packs
pendingRewards
liveEvents
```

O objetivo é que o Ravel consiga visualizar e gerenciar dados reais do sistema.

---

## 1. Objetivo da etapa

Implementar no painel admin:

- `/admin/patos` lendo patos reais da coleção `ducks`;
- `/admin/cartas` lendo cartas reais da coleção `cards`;
- `/admin/pacotes` lendo pacotes reais da coleção `packs`;
- `/admin/ravelboxes` lendo recompensas reais da coleção `pendingRewards`;
- `/admin/liberar-pacote` listando usuários reais da coleção `users`;
- dashboard `/admin` usando contadores reais;
- services para listar usuários e recompensas pendentes;
- botões básicos de criar/editar ainda podem ficar para etapa futura.

Nesta etapa, o foco é **leitura real** e substituição dos mocks.

---

## 2. Coleções usadas

Nesta etapa vamos usar:

```txt
users
ducks
cards
packs
pendingRewards
liveEvents
```

### `users`

Usuários cadastrados no sistema.

### `ducks`

Patos base cadastrados.

### `cards`

Cartas disponíveis nos pacotes.

### `packs`

Modelos de pacote.

### `pendingRewards`

Recompensas pendentes, principalmente Ravelboxes.

### `liveEvents`

Eventos recentes da live.

---

## 3. Estrutura de arquivos

Crie ou atualize:

```txt
services/
  users-service.ts
  ducks-service.ts
  cards-service.ts
  packs-service.ts
  pending-rewards-service.ts

app/
  admin/
    page.tsx
    patos/
      page.tsx
    cartas/
      page.tsx
    pacotes/
      page.tsx
    liberar-pacote/
      page.tsx
    ravelboxes/
      page.tsx

components/
  admin/
    AdminStatusBadge.tsx
    AdminDataTable.tsx
    AdminSectionHeader.tsx
    AdminStatCard.tsx
```

---

## 4. Atualizar `users-service.ts` para listar usuários reais

Abra:

```txt
services/users-service.ts
```

Adicione os imports, se ainda não existirem:

```ts
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
```

Depois adicione esta função:

```ts
export async function listUsers() {
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((userDocument) => {
    const data = userDocument.data();

    return {
      ...data,
      id: userDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as AppUser;
  });
}
```

Se o Firestore pedir índice para `createdAt`, crie pelo link que aparecer no console.  
Se quiser evitar índice por enquanto, remova o `orderBy`.

---

## 5. Atualizar `pending-rewards-service.ts`

Abra:

```txt
services/pending-rewards-service.ts
```

Hoje ele provavelmente só cria Ravelbox pendente. Vamos adicionar funções de listagem e atualização.

Adicione imports:

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
import { PendingRewardDocument, PendingRewardStatus } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
```

O arquivo pode ficar assim:

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
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { PendingRewardDocument, PendingRewardStatus } from "@/types/database";

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

export async function listPendingRewards() {
  const rewardsRef = collection(db, "pendingRewards");
  const rewardsQuery = query(rewardsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs.map((rewardDocument) => {
    const data = rewardDocument.data();

    return {
      ...data,
      id: rewardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      deliveredAt: data.deliveredAt ? timestampToDate(data.deliveredAt) : undefined,
    } as PendingRewardDocument;
  });
}

export async function listPendingRavelboxes() {
  const rewardsRef = collection(db, "pendingRewards");

  const rewardsQuery = query(
    rewardsRef,
    where("rewardType", "==", "ravelbox"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs.map((rewardDocument) => {
    const data = rewardDocument.data();

    return {
      ...data,
      id: rewardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      deliveredAt: data.deliveredAt ? timestampToDate(data.deliveredAt) : undefined,
    } as PendingRewardDocument;
  });
}

export async function updatePendingRewardStatus(
  rewardId: string,
  status: PendingRewardStatus
) {
  const rewardRef = doc(db, "pendingRewards", rewardId);

  await updateDoc(rewardRef, {
    status,
    deliveredAt: status === "delivered" ? serverTimestamp() : null,
  });
}
```

---

## 6. Garantir funções de listagem nos services existentes

Você já deve ter:

```txt
services/ducks-service.ts
services/cards-service.ts
services/packs-service.ts
```

Confirme se existem estas funções:

```ts
listDucks()
listActiveCards()
listActivePacks()
```

Se não existirem, adicione.

### `ducks-service.ts`

```ts
export async function listDucks() {
  const ducksRef = collection(db, "ducks");
  const ducksQuery = query(ducksRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(ducksQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}
```

Se quiser melhor tipagem:

```ts
export async function listDucks() {
  const ducksRef = collection(db, "ducks");
  const ducksQuery = query(ducksRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(ducksQuery);

  return snapshot.docs.map((duckDocument) => {
    const data = duckDocument.data();

    return {
      ...data,
      id: duckDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as DuckDocument;
  });
}
```

### `cards-service.ts`

Você já deve ter:

```ts
listActiveCards()
```

### `packs-service.ts`

Você já deve ter:

```ts
listActivePacks()
```

---

## 7. Criar helper para enriquecer Ravelboxes com usuário

A recompensa pendente tem `userId`, mas o admin precisa ver `displayName` e `username`.

Crie uma função em:

```txt
services/pending-rewards-service.ts
```

Adicione:

```ts
import { getUserProfile } from "./users-service";
```

Depois adicione:

```ts
export async function listPendingRewardsWithUsers() {
  const rewards = await listPendingRewards();

  const enrichedRewards = await Promise.all(
    rewards.map(async (reward) => {
      const user = await getUserProfile(reward.userId);

      return {
        reward,
        user,
      };
    })
  );

  return enrichedRewards;
}
```

---

## 8. Atualizar `/admin/patos` para dados reais

Substitua:

```txt
app/admin/patos/page.tsx
```

Por:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listDucks } from "@/services/ducks-service";
import { DuckDocument } from "@/types/database";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export default function AdminDucksPage() {
  const [ducks, setDucks] = useState<DuckDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDucks() {
    try {
      setIsLoading(true);
      const data = await listDucks();
      setDucks(data as DuckDocument[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDucks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Patos"
        description="Gerencie os patinhos colecionáveis cadastrados no Firestore."
        actionLabel="Novo pato"
      />

      <AdminDataTable headers={["Nome", "Tema", "Raridade", "Nível máximo", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando patos...
            </td>
          </tr>
        )}

        {!isLoading && ducks.length === 0 && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum pato cadastrado.
            </td>
          </tr>
        )}

        {!isLoading &&
          ducks.map((duck) => (
            <tr key={duck.id}>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {duck.name}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {duck.theme}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {rarityLabel[duck.rarity]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {duck.maxLevel}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={duck.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 9. Atualizar `/admin/cartas` para dados reais

Substitua:

```txt
app/admin/cartas/page.tsx
```

Por:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listActiveCards } from "@/services/cards-service";
import { CardDocument } from "@/types/database";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
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

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCards() {
    try {
      setIsLoading(true);
      const data = await listActiveCards();
      setCards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Cartas"
        description="Cartas reais cadastradas no Firestore e disponíveis para pacotes."
        actionLabel="Nova carta"
      />

      <AdminDataTable headers={["Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando cartas...
            </td>
          </tr>
        )}

        {!isLoading && cards.length === 0 && (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma carta cadastrada.
            </td>
          </tr>
        )}

        {!isLoading &&
          cards.map((card) => (
            <tr key={card.id}>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {card.name}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {typeLabel[card.type]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {rarityLabel[card.rarity]}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {card.duckId ?? "-"}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={card.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 10. Atualizar `/admin/pacotes` para dados reais

Substitua:

```txt
app/admin/pacotes/page.tsx
```

Por:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { listActivePacks } from "@/services/packs-service";
import { PackDocument } from "@/types/database";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<PackDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPacks() {
    try {
      setIsLoading(true);
      const data = await listActivePacks();
      setPacks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPacks();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Pacotes"
        description="Modelos de pacotes reais cadastrados no Firestore."
        actionLabel="Novo pacote"
      />

      <AdminDataTable headers={["Nome", "Cartas por pacote", "Cartas no pool", "Status"]}>
        {isLoading && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando pacotes...
            </td>
          </tr>
        )}

        {!isLoading && packs.length === 0 && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum pacote cadastrado.
            </td>
          </tr>
        )}

        {!isLoading &&
          packs.map((pack) => (
            <tr key={pack.id}>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">{pack.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{pack.description}</p>
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {pack.cardsQuantity}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {pack.cardPool.length}
              </td>
              <td className="px-5 py-4">
                <AdminStatusBadge status={pack.active ? "active" : "inactive"} />
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 11. Atualizar `/admin/ravelboxes` para dados reais

Substitua:

```txt
app/admin/ravelboxes/page.tsx
```

Por:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  listPendingRewardsWithUsers,
  updatePendingRewardStatus,
} from "@/services/pending-rewards-service";
import { AppUser, PendingRewardDocument } from "@/types/database";

interface RewardWithUser {
  reward: PendingRewardDocument;
  user: AppUser | null;
}

export default function AdminRavelboxesPage() {
  const [rewards, setRewards] = useState<RewardWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRewards() {
    try {
      setIsLoading(true);
      const data = await listPendingRewardsWithUsers();
      setRewards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsDelivered(rewardId: string) {
    try {
      await updatePendingRewardStatus(rewardId, "delivered");
      await loadRewards();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadRewards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Ravelboxes"
        description="Ravelboxes reais desbloqueadas pelos usuários e pendentes de entrega."
      />

      <AdminDataTable headers={["Usuário", "Origem", "Recompensa", "Data", "Status", "Ação"]}>
        {isLoading && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando Ravelboxes...
            </td>
          </tr>
        )}

        {!isLoading && rewards.length === 0 && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma Ravelbox pendente.
            </td>
          </tr>
        )}

        {!isLoading &&
          rewards.map(({ reward, user }) => (
            <tr key={reward.id}>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">
                  {user?.displayName ?? "Usuário não encontrado"}
                </p>
                <p className="text-xs text-zinc-500">
                  @{user?.username ?? reward.userId}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.source}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.rewardName}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.createdAt.toLocaleDateString("pt-BR")}
              </td>

              <td className="px-5 py-4">
                <AdminStatusBadge status={reward.status} />
              </td>

              <td className="px-5 py-4">
                {reward.status === "pending" ? (
                  <button
                    onClick={() => markAsDelivered(reward.id)}
                    className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-yellow-300"
                  >
                    Marcar entregue
                  </button>
                ) : (
                  <span className="text-xs font-bold text-zinc-500">
                    Entregue
                  </span>
                )}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 12. Atualizar `/admin/liberar-pacote` para listar usuários reais

Substitua:

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
import { listUsers } from "@/services/users-service";
import { AppUser, PackDocument } from "@/types/database";

export default function AdminGrantPackPage() {
  const { user } = useAuthUser();

  const [packs, setPacks] = useState<PackDocument[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPackId, setSelectedPackId] = useState("");
  const [reason, setReason] = useState<
    "live_purchase" | "event_reward" | "manual_bonus" | "admin"
  >("live_purchase");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [activePacks, realUsers] = await Promise.all([
        listActivePacks(),
        listUsers(),
      ]);

      setPacks(activePacks);
      setUsers(realUsers);

      if (activePacks.length > 0) {
        setSelectedPackId(activePacks[0].id);
      }

      if (realUsers.length > 0) {
        setSelectedUserId(realUsers[0].id);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar usuários ou pacotes.");
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
    loadData();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Liberar pacote"
        description="Libere um pacote real para qualquer usuário cadastrado no Firestore."
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
              {users.map((appUser) => (
                <option key={appUser.id} value={appUser.id}>
                  {appUser.displayName} (@{appUser.username}) — {appUser.email}
                </option>
              ))}
            </select>
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

## 13. Atualizar `/admin` dashboard para contadores reais

Substitua:

```txt
app/admin/page.tsx
```

Por:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { listActiveCards } from "@/services/cards-service";
import { listDucks } from "@/services/ducks-service";
import { listLatestLiveEvents } from "@/services/live-events-service";
import { listActivePacks } from "@/services/packs-service";
import { listPendingRewards } from "@/services/pending-rewards-service";
import { listUsers } from "@/services/users-service";
import { LiveEventDocument } from "@/types/live-event";

interface AdminDashboardStats {
  ducks: number;
  cards: number;
  packs: number;
  users: number;
  pendingRewards: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    ducks: 0,
    cards: 0,
    packs: 0,
    users: 0,
    pendingRewards: 0,
  });

  const [events, setEvents] = useState<LiveEventDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    try {
      setIsLoading(true);

      const [ducks, cards, packs, users, rewards, latestEvents] =
        await Promise.all([
          listDucks(),
          listActiveCards(),
          listActivePacks(),
          listUsers(),
          listPendingRewards(),
          listLatestLiveEvents(5),
        ]);

      setStats({
        ducks: ducks.length,
        cards: cards.length,
        packs: packs.length,
        users: users.length,
        pendingRewards: rewards.filter((reward) => reward.status === "pending")
          .length,
      });

      setEvents(latestEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Dashboard"
        description="Visão geral real do sistema Ravel Ducks com dados do Firestore."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Patos" value={stats.ducks} />
        <AdminStatCard label="Cartas" value={stats.cards} />
        <AdminStatCard label="Pacotes" value={stats.packs} />
        <AdminStatCard label="Usuários" value={stats.users} />
        <AdminStatCard label="Recompensas pendentes" value={stats.pendingRewards} />
      </section>

      <AdminDataTable headers={["Evento recente", "Tipo", "Horário"]}>
        {isLoading && (
          <tr>
            <td colSpan={3} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando dashboard...
            </td>
          </tr>
        )}

        {!isLoading && events.length === 0 && (
          <tr>
            <td colSpan={3} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum evento recente.
            </td>
          </tr>
        )}

        {!isLoading &&
          events.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-white">
                  {event.icon} {event.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {event.description}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {event.type}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {event.createdAt.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 14. Possível problema com `AdminStatusBadge`

Na Etapa 12, talvez `AdminStatusBadge` aceite:

```ts
AdminStatus | "delivered"
```

Mas agora `PendingRewardStatus` também tem:

```txt
cancelled
```

Atualize:

```txt
components/admin/AdminStatusBadge.tsx
```

Para aceitar `cancelled`.

Exemplo:

```tsx
interface AdminStatusBadgeProps {
  status:
    | "active"
    | "inactive"
    | "pending"
    | "delivered"
    | "cancelled";
}

const statusLabel = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusStyle = {
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  inactive: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  pending: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
  delivered: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  cancelled: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase",
        statusStyle[status],
      ].join(" ")}
    >
      {statusLabel[status]}
    </span>
  );
}
```

---

## 15. Atualizar regras do Firestore

As regras da Etapa 12 já devem funcionar.

Garanta que admin consegue ler as coleções:

```txt
ducks
cards
packs
pendingRewards
users
liveEvents
```

Regra recomendada para continuar o desenvolvimento:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function userDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && userDoc().data.role == "admin";
    }

    match /liveEvents/{eventId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

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

    match /grantedPacks/{grantedPackId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAdmin();
      allow update: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }

    match /packOpenings/{openingId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    match /userDucks/{userDuckId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create, update: if isSignedIn();
      allow delete: if isAdmin();
    }

    match /pendingRewards/{rewardId} {
      allow read: if isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    match /islands/{islandId} {
      allow read: if resource.data.public == true || isAdmin();
      allow create, update: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }
  }
}
```

---

## 16. Fluxo de teste

### 1. Rodar projeto

```bash
npm run dev
```

### 2. Fazer login como admin

Acesse:

```txt
/login
```

Entre com a conta admin.

### 3. Testar dashboard

Acesse:

```txt
/admin
```

Resultado esperado:

```txt
contadores reais de patos, cartas, pacotes, usuários e recompensas pendentes
eventos reais recentes
```

### 4. Testar patos

Acesse:

```txt
/admin/patos
```

Resultado esperado:

```txt
lista de ducks reais do Firestore
```

### 5. Testar cartas

Acesse:

```txt
/admin/cartas
```

Resultado esperado:

```txt
lista de cards reais do Firestore
```

### 6. Testar pacotes

Acesse:

```txt
/admin/pacotes
```

Resultado esperado:

```txt
lista de packs reais do Firestore
```

### 7. Testar liberar pacote

Acesse:

```txt
/admin/liberar-pacote
```

Resultado esperado:

```txt
select de usuários reais
select de pacotes reais
liberação criando grantedPacks
```

### 8. Testar Ravelboxes

Acesse:

```txt
/admin/ravelboxes
```

Resultado esperado:

```txt
lista real de pendingRewards
botão para marcar entregue
```

---

## 17. Problemas comuns

### Erro de permissão

Verifique se:

```txt
sua conta tem role admin
as regras foram publicadas
você está logado
```

### Nada aparece em `/admin/patos`

Verifique se você rodou:

```txt
/admin/seed
```

### Nada aparece em `/admin/cartas` ou `/admin/pacotes`

Verifique se você rodou:

```txt
/admin/seed-packs
```

### Nada aparece em `/admin/ravelboxes`

Abra pacotes até gerar uma Ravelbox ou crie evento/recompensa manual.

### Select de usuários vazio

Verifique se existem documentos na coleção:

```txt
users
```

Eles são criados quando alguém se cadastra em `/cadastro`.

---

## 18. O que essa etapa entrega

Ao final da Etapa 13, você terá:

```txt
/admin com contadores reais
/admin/patos lendo ducks reais
/admin/cartas lendo cards reais
/admin/pacotes lendo packs reais
/admin/liberar-pacote listando users reais
/admin/ravelboxes lendo pendingRewards reais
botão para marcar Ravelbox como entregue
menos dependência de admin-mock-data
```

---

## 19. Limitações desta etapa

Ainda teremos:

```txt
botão Novo pato não cria pato
botão Nova carta não cria carta
botão Novo pacote não cria pacote
edição de registros ainda não existe
exclusão/desativação ainda não existe
admin ainda depende das páginas seed para criar dados
```

---

## 20. Próxima etapa

A próxima etapa recomendada será:

```txt
Etapa 14 — Formulários reais de criação no admin
```

Nela vamos implementar:

```txt
criar pato pelo painel
criar carta pelo painel
criar pacote pelo painel
selecionar cartas do pacote
criar trilha de recompensas do pato pelo painel
desativar patos/cartas/pacotes
```
