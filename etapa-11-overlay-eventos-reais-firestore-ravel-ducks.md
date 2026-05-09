# Etapa 11 — Conectar Overlay com Eventos Reais do Firestore

Nesta etapa vamos transformar o overlay da live em uma tela dinâmica, conectada ao Firestore.

Na Etapa 10, criamos as páginas visuais:

```txt
/overlay/live
/overlay/live/compact
/overlay/live/alert
```

Mas elas ainda usam dados mockados em:

```txt
lib/overlay-mock-data.ts
```

Agora vamos criar uma coleção real no Firestore chamada:

```txt
liveEvents
```

E fazer o overlay escutar esses eventos em tempo real.

---

## 1. Objetivo da etapa

Criar um fluxo real onde eventos importantes do sistema aparecem automaticamente no overlay da live.

Exemplo:

```txt
Usuário abre pacote
        ↓
Sistema cria evento em liveEvents
        ↓
Overlay escuta o Firestore em tempo real
        ↓
Evento aparece na live
```

Nesta etapa vamos implementar:

- tipos de evento real;
- serviço para criar eventos da live;
- serviço para ouvir eventos em tempo real;
- integração com abertura de pacotes;
- integração com Ravelbox;
- overlay lendo dados reais;
- página admin para visualizar eventos;
- botão para criar evento de teste.

---

## 2. Coleção `liveEvents`

Vamos criar uma nova coleção no Firestore:

```txt
liveEvents
```

Cada documento representa um evento que pode aparecer na live.

Exemplo:

```ts
{
  id: "event-001",
  userId: "UID_DO_USUARIO",
  username: "guilherme",
  displayName: "Guilherme",
  type: "ravelbox",
  title: "Ravelbox desbloqueada!",
  description: "Guilherme desbloqueou uma Ravelbox.",
  rarity: "legendary",
  icon: "🎁",
  createdAt: Timestamp,
  consumed: false
}
```

---

## 3. Tipos de evento

Os principais tipos serão:

```txt
pack_opened
rare_card
level_up
ravelbox
duck_unlocked
```

### `pack_opened`

Quando o usuário abre um pacote.

### `rare_card`

Quando uma carta épica ou lendária aparece.

### `level_up`

Quando um pato sobe de nível.

### `ravelbox`

Quando uma Ravelbox é desbloqueada.

### `duck_unlocked`

Quando o usuário desbloqueia um pato novo.

---

## 4. Estrutura de arquivos

Crie ou atualize:

```txt
types/
  live-event.ts

services/
  live-events-service.ts
  pack-results-service.ts
  pack-openings-service.ts

hooks/
  use-live-events.ts

app/
  overlay/
    live/
      page.tsx
      compact/
        page.tsx
      alert/
        page.tsx
  admin/
    live-events/
      page.tsx
    live-events-test/
      page.tsx

components/
  overlay/
    LiveOverlayHeader.tsx
    LiveOverlayHighlight.tsx
    LiveOverlayEventCard.tsx
    LiveOverlayEventList.tsx

  admin/
    AdminLiveEventsTable.tsx
```

---

## 5. Criar tipos de evento real

Crie:

```txt
types/live-event.ts
```

Com o conteúdo:

```ts
export type LiveEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export type LiveEventRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export interface LiveEventDocument {
  id: string;
  userId?: string;
  username: string;
  displayName: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
  consumed: boolean;
  createdAt: Date;
}
```

---

## 6. Criar serviço `live-events-service`

Crie:

```txt
services/live-events-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  LiveEventDocument,
  LiveEventRarity,
  LiveEventType,
} from "@/types/live-event";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreateLiveEventInput {
  userId?: string;
  username: string;
  displayName: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
}

export async function createLiveEvent(input: CreateLiveEventInput) {
  const eventRef = doc(collection(db, "liveEvents"));

  await setDoc(eventRef, {
    id: eventRef.id,
    userId: input.userId ?? null,
    username: input.username,
    displayName: input.displayName,
    type: input.type,
    title: input.title,
    description: input.description,
    rarity: input.rarity ?? null,
    icon: input.icon,
    consumed: false,
    createdAt: serverTimestamp(),
  });

  return eventRef.id;
}

export async function listLatestLiveEvents(maxItems = 10) {
  const eventsRef = collection(db, "liveEvents");

  const eventsQuery = query(
    eventsRef,
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );

  const snapshot = await getDocs(eventsQuery);

  return snapshot.docs.map((eventDocument) => {
    const data = eventDocument.data();

    return {
      ...data,
      id: eventDocument.id,
      rarity: data.rarity ?? undefined,
      createdAt: timestampToDate(data.createdAt),
    } as LiveEventDocument;
  });
}

export function subscribeToLatestLiveEvents(
  callback: (events: LiveEventDocument[]) => void,
  maxItems = 10
) {
  const eventsRef = collection(db, "liveEvents");

  const eventsQuery = query(
    eventsRef,
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );

  const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((eventDocument) => {
      const data = eventDocument.data();

      return {
        ...data,
        id: eventDocument.id,
        rarity: data.rarity ?? undefined,
        createdAt: timestampToDate(data.createdAt),
      } as LiveEventDocument;
    });

    callback(events);
  });

  return unsubscribe;
}

export async function markLiveEventAsConsumed(eventId: string) {
  const eventRef = doc(db, "liveEvents", eventId);

  await updateDoc(eventRef, {
    consumed: true,
  });
}
```

---

## 7. Criar hook `use-live-events`

Crie:

```txt
hooks/use-live-events.ts
```

Com o conteúdo:

```ts
"use client";

import { useEffect, useState } from "react";
import { subscribeToLatestLiveEvents } from "@/services/live-events-service";
import { LiveEventDocument } from "@/types/live-event";

export function useLiveEvents(maxItems = 10) {
  const [events, setEvents] = useState<LiveEventDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLatestLiveEvents((latestEvents) => {
      setEvents(latestEvents);
      setIsLoading(false);
    }, maxItems);

    return () => unsubscribe();
  }, [maxItems]);

  return {
    events,
    isLoading,
    highlightEvent: events[0] ?? null,
    recentEvents: events.slice(1),
  };
}
```

---

## 8. Migrar os componentes do overlay para `LiveEventDocument`

Na Etapa 10, seus componentes usam:

```txt
types/overlay.ts
```

Agora vamos usar:

```txt
types/live-event.ts
```

Atualize os componentes do overlay para importar:

```ts
import { LiveEventDocument } from "@/types/live-event";
```

E trocar o tipo de prop de:

```ts
LiveOverlayEvent
```

para:

```ts
LiveEventDocument
```

---

## 9. Atualizar `LiveOverlayHighlight`

Abra:

```txt
components/overlay/LiveOverlayHighlight.tsx
```

Troque o import:

```ts
import { LiveOverlayEvent } from "@/types/overlay";
```

Por:

```ts
import { LiveEventDocument } from "@/types/live-event";
```

Ajuste a interface:

```ts
interface LiveOverlayHighlightProps {
  event: LiveEventDocument;
}
```

Se o componente mostrar horário, use:

```ts
event.createdAt.toLocaleTimeString("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
})
```

---

## 10. Atualizar `LiveOverlayEventCard`

Abra:

```txt
components/overlay/LiveOverlayEventCard.tsx
```

Troque:

```ts
import { LiveOverlayEvent } from "@/types/overlay";
```

Por:

```ts
import { LiveEventDocument } from "@/types/live-event";
```

Ajuste a interface:

```ts
interface LiveOverlayEventCardProps {
  event: LiveEventDocument;
}
```

E substitua a exibição de `createdAt`.

Antes:

```tsx
{event.createdAt}
```

Depois:

```tsx
{event.createdAt.toLocaleTimeString("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
})}
```

---

## 11. Atualizar `LiveOverlayEventList`

Abra:

```txt
components/overlay/LiveOverlayEventList.tsx
```

Use:

```tsx
import { LiveEventDocument } from "@/types/live-event";
import { LiveOverlayEventCard } from "./LiveOverlayEventCard";

interface LiveOverlayEventListProps {
  events: LiveEventDocument[];
}

export function LiveOverlayEventList({ events }: LiveOverlayEventListProps) {
  return (
    <section className="grid gap-3">
      <div className="rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 shadow-xl backdrop-blur">
        <h2 className="text-lg font-black text-white">Últimos eventos</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Acompanhe as interações recentes da comunidade.
        </p>
      </div>

      <div className="grid gap-3">
        {events.map((event) => (
          <LiveOverlayEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
```

---

## 12. Atualizar `/overlay/live`

Substitua:

```txt
app/overlay/live/page.tsx
```

Por:

```tsx
"use client";

import { LiveOverlayEventList } from "@/components/overlay/LiveOverlayEventList";
import { LiveOverlayHeader } from "@/components/overlay/LiveOverlayHeader";
import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function LiveOverlayPage() {
  const { highlightEvent, recentEvents, isLoading } = useLiveEvents(6);

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <div className="grid h-full min-h-[calc(100vh-48px)] gap-5 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col justify-end gap-5">
          <LiveOverlayHeader />

          {isLoading && (
            <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-white">
              Carregando eventos...
            </div>
          )}

          {!isLoading && highlightEvent && (
            <LiveOverlayHighlight event={highlightEvent} />
          )}

          {!isLoading && !highlightEvent && (
            <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-white">
              Nenhum evento na live ainda.
            </div>
          )}
        </section>

        <aside className="flex flex-col justify-end">
          <LiveOverlayEventList events={recentEvents} />
        </aside>
      </div>
    </main>
  );
}
```

---

## 13. Atualizar `/overlay/live/compact`

Substitua:

```txt
app/overlay/live/compact/page.tsx
```

Por:

```tsx
"use client";

import { LiveOverlayEventCard } from "@/components/overlay/LiveOverlayEventCard";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function CompactLiveOverlayPage() {
  const { events, isLoading } = useLiveEvents(3);

  return (
    <main className="min-h-screen bg-transparent p-4 text-white">
      <section className="fixed bottom-6 right-6 grid w-[420px] gap-3">
        {isLoading && (
          <div className="rounded-2xl border border-zinc-800 bg-black/70 p-4 text-sm font-bold text-white">
            Carregando eventos...
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-black/70 p-4 text-sm font-bold text-white">
            Nenhum evento ainda.
          </div>
        )}

        {events.map((event) => (
          <LiveOverlayEventCard key={event.id} event={event} />
        ))}
      </section>
    </main>
  );
}
```

---

## 14. Atualizar `/overlay/live/alert`

Substitua:

```txt
app/overlay/live/alert/page.tsx
```

Por:

```tsx
"use client";

import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function AlertLiveOverlayPage() {
  const { highlightEvent, isLoading } = useLiveEvents(1);

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <section className="fixed bottom-8 left-1/2 w-full max-w-4xl -translate-x-1/2">
        {isLoading && (
          <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center text-white">
            Carregando evento...
          </div>
        )}

        {!isLoading && highlightEvent && (
          <LiveOverlayHighlight event={highlightEvent} />
        )}

        {!isLoading && !highlightEvent && (
          <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center text-white">
            Nenhum alerta disponível.
          </div>
        )}
      </section>
    </main>
  );
}
```

---

## 15. Criar eventos durante abertura de pacote

Abra:

```txt
services/pack-openings-service.ts
```

Adicione import:

```ts
import { createLiveEvent } from "./live-events-service";
```

Após aplicar o resultado do pacote, crie evento de pacote aberto.

Procure:

```ts
const applicationResult = await applyPackResultToCollection({
  userId: input.userId,
  cards,
});
```

Logo depois, adicione:

```ts
await createLiveEvent({
  userId: input.userId,
  username: "user",
  displayName: "Usuário",
  type: "pack_opened",
  title: "Pacote aberto!",
  description: `Um pacote foi aberto e revelou ${cards.length} cartas.`,
  rarity: "rare",
  icon: "🎴",
});
```

Nesta primeira versão, usamos `username: "user"` porque o serviço de abertura ainda não carrega o perfil do usuário.

---

## 16. Criar eventos para cartas raras

Ainda em:

```txt
services/pack-openings-service.ts
```

Depois do evento de pacote aberto, adicione:

```ts
const rareCards = cards.filter(
  (card) => card.rarity === "epic" || card.rarity === "legendary"
);

for (const card of rareCards) {
  await createLiveEvent({
    userId: input.userId,
    username: "user",
    displayName: "Usuário",
    type: "rare_card",
    title:
      card.rarity === "legendary"
        ? "Carta lendária revelada!"
        : "Carta épica revelada!",
    description: `A carta ${card.name} apareceu na abertura do pacote.`,
    rarity: card.rarity,
    icon: card.rarity === "legendary" ? "👑" : "✨",
  });
}
```

---

## 17. Criar eventos no `pack-results-service`

Abra:

```txt
services/pack-results-service.ts
```

Adicione:

```ts
import { createLiveEvent } from "./live-events-service";
```

No bloco onde pato novo é desbloqueado, após:

```ts
messages.push(`${card.name} desbloqueado.`);
```

Adicione:

```ts
await createLiveEvent({
  userId: input.userId,
  username: "user",
  displayName: "Usuário",
  type: "duck_unlocked",
  title: "Novo pato desbloqueado!",
  description: `${card.name} entrou para a coleção.`,
  rarity: card.rarity,
  icon: "🦆",
});
```

No bloco onde Ravelbox é criada, após:

```ts
messages.push(`${card.name} adicionada como recompensa pendente.`);
```

Adicione:

```ts
await createLiveEvent({
  userId: input.userId,
  username: "user",
  displayName: "Usuário",
  type: "ravelbox",
  title: "Ravelbox desbloqueada!",
  description: `${card.name} foi adicionada como recompensa pendente.`,
  rarity: "legendary",
  icon: "🎁",
});
```

---

## 18. Criar eventos para level up

Ainda no `pack-results-service.ts`, quando `result.newLevel > result.previousLevel`, crie um evento.

Exemplo para o bloco `duck_xp`:

```ts
if (result.newLevel > result.previousLevel) {
  await createLiveEvent({
    userId: input.userId,
    username: "user",
    displayName: "Usuário",
    type: "level_up",
    title: "Pato subiu de nível!",
    description: `Um pato subiu para o nível ${result.newLevel}.`,
    rarity: "epic",
    icon: "✨",
  });
}
```

Faça o mesmo no bloco de pato duplicado.

---

## 19. Criar página admin de eventos

Crie:

```txt
app/admin/live-events/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useLiveEvents } from "@/hooks/use-live-events";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";

export default function AdminLiveEventsPage() {
  const { events, isLoading } = useLiveEvents(20);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Eventos da Live"
        description="Veja os eventos mais recentes enviados para o overlay da live."
      />

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Evento
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Usuário
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Tipo
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Raridade
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Horário
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-zinc-400"
                  >
                    Carregando eventos...
                  </td>
                </tr>
              )}

              {!isLoading &&
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-white">
                        {event.icon} {event.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {event.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      @{event.username}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.type}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.rarity ?? "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {event.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
```

---

## 20. Criar página para evento de teste

Crie:

```txt
app/admin/live-events-test/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { createLiveEvent } from "@/services/live-events-service";

type TestEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export default function AdminLiveEventsTestPage() {
  const [message, setMessage] = useState("");

  async function createTestEvent(type: TestEventType) {
    try {
      setMessage("Criando evento...");

      const eventMap = {
        pack_opened: {
          title: "Pacote aberto!",
          description: "Evento de teste: um pacote foi aberto.",
          rarity: "rare" as const,
          icon: "🎴",
        },
        rare_card: {
          title: "Carta lendária revelada!",
          description: "Evento de teste: uma carta lendária apareceu.",
          rarity: "legendary" as const,
          icon: "👑",
        },
        level_up: {
          title: "Pato subiu de nível!",
          description: "Evento de teste: um pato subiu de nível.",
          rarity: "epic" as const,
          icon: "✨",
        },
        ravelbox: {
          title: "Ravelbox desbloqueada!",
          description: "Evento de teste: uma Ravelbox foi desbloqueada.",
          rarity: "legendary" as const,
          icon: "🎁",
        },
        duck_unlocked: {
          title: "Novo pato desbloqueado!",
          description: "Evento de teste: um novo pato entrou na coleção.",
          rarity: "epic" as const,
          icon: "🦆",
        },
      };

      const eventData = eventMap[type];

      await createLiveEvent({
        userId: "test-user",
        username: "teste",
        displayName: "Usuário Teste",
        type,
        title: eventData.title,
        description: eventData.description,
        rarity: eventData.rarity,
        icon: eventData.icon,
      });

      setMessage("Evento criado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar evento.");
    }
  }

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Teste de eventos"
        description="Crie eventos manuais para testar o overlay no navegador ou no OBS."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <button
          onClick={() => createTestEvent("pack_opened")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🎴 Criar pacote aberto
        </button>

        <button
          onClick={() => createTestEvent("rare_card")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          👑 Criar carta lendária
        </button>

        <button
          onClick={() => createTestEvent("level_up")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          ✨ Criar level up
        </button>

        <button
          onClick={() => createTestEvent("ravelbox")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🎁 Criar Ravelbox
        </button>

        <button
          onClick={() => createTestEvent("duck_unlocked")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🦆 Criar novo pato
        </button>
      </section>

      {message && (
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
          {message}
        </div>
      )}
    </AdminLayout>
  );
}
```

---

## 21. Atualizar menu admin

Abra:

```txt
components/admin/AdminSidebar.tsx
```

Adicione links:

```ts
{
  href: "/admin/live-events",
  label: "Eventos da live",
},
{
  href: "/admin/live-events-test",
  label: "Teste de eventos",
},
```

---

## 22. Regras do Firestore

Durante desenvolvimento, esta regra ainda funciona:

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

Mas atenção: o overlay no OBS talvez não esteja autenticado.

Se o overlay precisar ler eventos sem login, permita leitura pública de `liveEvents`.

Regra temporária:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /liveEvents/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Isso permite:

```txt
qualquer pessoa pode ler eventos da live
somente usuário logado pode criar eventos
```

Futuramente, a escrita deve ser restrita ao admin ou ao backend.

---

## 23. Fluxo de teste

### 1. Rodar projeto

```bash
npm run dev
```

### 2. Abrir overlay em uma aba

```txt
http://localhost:3000/overlay/live
```

Ou:

```txt
http://localhost:3000/overlay/live/compact
```

Ou:

```txt
http://localhost:3000/overlay/live/alert
```

### 3. Em outra aba, criar evento de teste

Acesse:

```txt
http://localhost:3000/admin/live-events-test
```

Clique em:

```txt
Criar Ravelbox
```

### 4. Ver overlay atualizar

A aba do overlay deve atualizar automaticamente.

### 5. Testar evento real

Depois teste:

```txt
/admin/liberar-pacote
/pacotes
abrir pacote
/overlay/live
```

Ao abrir pacote, o overlay deve receber eventos reais.

---

## 24. Possíveis problemas

### Overlay não atualiza

Verifique:

```txt
se liveEvents está recebendo documentos
se as regras permitem leitura
se a página overlay está com "use client"
se o hook useLiveEvents está sendo chamado
```

### Erro de índice Firestore

A consulta usa:

```ts
orderBy("createdAt", "desc")
limit(10)
```

Essa consulta normalmente não exige índice composto.

### Fundo preto no OBS

Se o overlay aparecer com fundo preto, pode ser por causa do CSS global.

Uma alternativa futura é criar um layout próprio para `/overlay`.

---

## 25. O que essa etapa entrega

Ao final da Etapa 11, você terá:

```txt
coleção liveEvents no Firestore
serviço para criar eventos da live
hook com onSnapshot em tempo real
overlay lendo eventos reais
eventos criados ao abrir pacote
eventos criados ao revelar carta rara
eventos criados ao desbloquear pato
eventos criados ao gerar Ravelbox
página admin para visualizar eventos
página admin para criar eventos de teste
```

---

## 26. Limitações desta etapa

Ainda teremos:

```txt
overlay sem fila de animações
eventos não são marcados como consumidos automaticamente
username/displayName ainda podem aparecer genéricos em alguns eventos
overlay não possui controle admin de ativar/desativar tipos
escrita em liveEvents ainda pode depender de regra temporária
```

---

## 27. Próxima etapa

A próxima etapa recomendada será:

```txt
Etapa 12 — Melhorar identidade do usuário nos eventos e proteger admin
```

Nela vamos:

```txt
buscar displayName e username reais em users
restringir rotas admin
proteger escrita em liveEvents
melhorar permissões do Firestore
criar controle admin para eventos
```
