# Etapa 10 — Overlay para Live / OBS

Nesta etapa vamos criar uma tela especial para ser usada como **overlay no OBS** durante a live do Ravel.

A rota será:

```txt
/overlay/live
```

Essa página não será uma tela comum do usuário. Ela será uma tela visual, limpa e própria para aparecer por cima da transmissão.

A ideia é que o Ravel consiga adicionar essa URL como **Browser Source** no OBS e exibir eventos do sistema, como:

```txt
último pacote aberto
última carta rara revelada
pato que subiu de nível
Ravelbox desbloqueada
evento recente da comunidade
```

Nesta primeira versão, o overlay ainda será visual e mockado. Depois ele poderá ser conectado ao Firestore para atualizar em tempo real.

---

## 1. Objetivo da etapa

Criar uma tela de overlay para live com:

- visual transparente ou escuro;
- card de evento recente;
- animação leve;
- lista de eventos da live;
- destaque para Ravelbox;
- destaque para carta lendária;
- estrutura pronta para receber dados reais do Firestore;
- layout compatível com OBS.

---

## 2. Por que essa etapa é importante?

O Ravel explicou que as cartas devem mexer com a stream, mas de forma leve, sem impactar muito.

Então o overlay serve para mostrar efeitos visuais controlados.

Em vez de o sistema alterar a live inteira, ele exibe pequenos eventos:

```txt
Guilherme abriu Pacote da Live
Levi revelou Pato Rei
Ravel desbloqueou uma Ravelbox
Player123 subiu Pato Junkrat para nível 5
```

Isso mantém a live interativa sem ficar bagunçada.

---

## 3. Estrutura de pastas

Como seu projeto está sem pasta `src`, vamos criar tudo na raiz:

```txt
ravel-ducks/
  app/
    overlay/
      live/
        page.tsx

  components/
    overlay/
      LiveOverlayEventCard.tsx
      LiveOverlayEventList.tsx
      LiveOverlayHighlight.tsx
      LiveOverlayHeader.tsx

  lib/
    overlay-mock-data.ts

  types/
    overlay.ts
```

---

## 4. Criar os tipos do overlay

Crie o arquivo:

```txt
types/overlay.ts
```

Com o conteúdo:

```ts
export type LiveOverlayEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export type LiveOverlayEventRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export interface LiveOverlayEvent {
  id: string;
  username: string;
  displayName: string;
  type: LiveOverlayEventType;
  title: string;
  description: string;
  rarity?: LiveOverlayEventRarity;
  icon: string;
  createdAt: string;
}
```

---

## 5. Criar os dados mockados do overlay

Crie o arquivo:

```txt
lib/overlay-mock-data.ts
```

Com o conteúdo:

```ts
import { LiveOverlayEvent } from "@/types/overlay";

export const mockLiveOverlayEvents: LiveOverlayEvent[] = [
  {
    id: "event-001",
    username: "guilherme",
    displayName: "Guilherme",
    type: "ravelbox",
    title: "Ravelbox desbloqueada!",
    description: "Guilherme desbloqueou uma Ravelbox ao evoluir o Pato Sombra.",
    rarity: "legendary",
    icon: "🎁",
    createdAt: "agora",
  },
  {
    id: "event-002",
    username: "levi",
    displayName: "Levi",
    type: "rare_card",
    title: "Carta lendária revelada!",
    description: "Levi revelou o Pato Rei no Pacote da Live.",
    rarity: "legendary",
    icon: "👑",
    createdAt: "2 min",
  },
  {
    id: "event-003",
    username: "ravel",
    displayName: "Ravel",
    type: "level_up",
    title: "Pato subiu de nível!",
    description: "Ravel evoluiu o Pato Junkrat para o nível 5.",
    rarity: "epic",
    icon: "✨",
    createdAt: "5 min",
  },
  {
    id: "event-004",
    username: "player123",
    displayName: "Player123",
    type: "pack_opened",
    title: "Pacote aberto!",
    description: "Player123 abriu um Pacote da Live com 4 cartas.",
    rarity: "rare",
    icon: "🎴",
    createdAt: "8 min",
  },
];
```

---

## 6. Criar o componente `LiveOverlayHeader`

Crie o arquivo:

```txt
components/overlay/LiveOverlayHeader.tsx
```

Com o conteúdo:

```tsx
export function LiveOverlayHeader() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-yellow-400/30 bg-black/70 px-5 py-4 shadow-2xl backdrop-blur">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-1 text-2xl font-black text-white">
          Eventos da Live
        </h1>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/40 bg-yellow-400/10 text-3xl">
        🦆
      </div>
    </header>
  );
}
```

---

## 7. Criar o componente `LiveOverlayHighlight`

Crie o arquivo:

```txt
components/overlay/LiveOverlayHighlight.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayEvent } from "@/types/overlay";

interface LiveOverlayHighlightProps {
  event: LiveOverlayEvent;
}

const rarityStyle = {
  common: "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
  rare: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  epic: "border-purple-400/40 bg-purple-400/10 text-purple-200",
  legendary: "border-yellow-400/50 bg-yellow-400/15 text-yellow-200",
};

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export function LiveOverlayHighlight({ event }: LiveOverlayHighlightProps) {
  const style = event.rarity
    ? rarityStyle[event.rarity]
    : "border-zinc-700 bg-zinc-900 text-zinc-300";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-400/40 bg-black/75 p-6 shadow-2xl backdrop-blur">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-28 w-28 shrink-0 animate-bounce items-center justify-center rounded-3xl border border-yellow-400/40 bg-zinc-950/80 text-6xl shadow-xl">
          {event.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-zinc-950">
              Destaque
            </span>

            {event.rarity && (
              <span
                className={[
                  "rounded-full border px-3 py-1 text-xs font-black uppercase",
                  style,
                ].join(" ")}
              >
                {rarityLabel[event.rarity]}
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black text-white">{event.title}</h2>

          <p className="mt-2 text-lg font-bold text-yellow-300">
            {event.displayName}
          </p>

          <p className="mt-2 text-sm text-zinc-300">{event.description}</p>
        </div>
      </div>
    </section>
  );
}
```

---

## 8. Criar o componente `LiveOverlayEventCard`

Crie o arquivo:

```txt
components/overlay/LiveOverlayEventCard.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayEvent } from "@/types/overlay";

interface LiveOverlayEventCardProps {
  event: LiveOverlayEvent;
}

const eventTypeLabel = {
  pack_opened: "Pacote",
  rare_card: "Carta rara",
  level_up: "Level up",
  ravelbox: "Ravelbox",
  duck_unlocked: "Novo pato",
};

const rarityBorder = {
  common: "border-zinc-500/40",
  rare: "border-sky-500/40",
  epic: "border-purple-500/40",
  legendary: "border-yellow-500/40",
};

export function LiveOverlayEventCard({ event }: LiveOverlayEventCardProps) {
  const border = event.rarity ? rarityBorder[event.rarity] : "border-zinc-800";

  return (
    <article
      className={[
        "rounded-2xl border bg-black/65 p-4 shadow-xl backdrop-blur",
        border,
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 text-3xl">
          {event.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-black uppercase text-zinc-300">
              {eventTypeLabel[event.type]}
            </span>

            <span className="text-[11px] font-bold text-zinc-500">
              {event.createdAt}
            </span>
          </div>

          <h3 className="truncate text-sm font-black text-white">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {event.description}
          </p>
        </div>
      </div>
    </article>
  );
}
```

---

## 9. Criar o componente `LiveOverlayEventList`

Crie o arquivo:

```txt
components/overlay/LiveOverlayEventList.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayEvent } from "@/types/overlay";
import { LiveOverlayEventCard } from "./LiveOverlayEventCard";

interface LiveOverlayEventListProps {
  events: LiveOverlayEvent[];
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

## 10. Criar a página `/overlay/live`

Crie o arquivo:

```txt
app/overlay/live/page.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayEventList } from "@/components/overlay/LiveOverlayEventList";
import { LiveOverlayHeader } from "@/components/overlay/LiveOverlayHeader";
import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { mockLiveOverlayEvents } from "@/lib/overlay-mock-data";

export default function LiveOverlayPage() {
  const [highlightEvent, ...recentEvents] = mockLiveOverlayEvents;

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <div className="grid h-full min-h-[calc(100vh-48px)] gap-5 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col justify-end gap-5">
          <LiveOverlayHeader />
          <LiveOverlayHighlight event={highlightEvent} />
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

## 11. Criar uma variação compacta do overlay

É útil ter uma versão menor para posicionar no canto da live.

Crie:

```txt
app/overlay/live/compact/page.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayEventCard } from "@/components/overlay/LiveOverlayEventCard";
import { mockLiveOverlayEvents } from "@/lib/overlay-mock-data";

export default function CompactLiveOverlayPage() {
  const latestEvents = mockLiveOverlayEvents.slice(0, 3);

  return (
    <main className="min-h-screen bg-transparent p-4 text-white">
      <section className="fixed bottom-6 right-6 grid w-[420px] gap-3">
        {latestEvents.map((event) => (
          <LiveOverlayEventCard key={event.id} event={event} />
        ))}
      </section>
    </main>
  );
}
```

---

## 12. Criar uma variação apenas de alerta

Essa variação pode ser usada para mostrar somente o evento mais importante.

Crie:

```txt
app/overlay/live/alert/page.tsx
```

Com o conteúdo:

```tsx
import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { mockLiveOverlayEvents } from "@/lib/overlay-mock-data";

export default function AlertLiveOverlayPage() {
  const highlightEvent = mockLiveOverlayEvents[0];

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <section className="fixed bottom-8 left-1/2 w-full max-w-4xl -translate-x-1/2">
        <LiveOverlayHighlight event={highlightEvent} />
      </section>
    </main>
  );
}
```

---

## 13. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Adicione links para testar o overlay.

Você pode acrescentar estes links dentro da área de botões:

```tsx
<Link
  href="/overlay/live"
  className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
>
  Overlay
</Link>

<Link
  href="/overlay/live/compact"
  className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
>
  Overlay compacto
</Link>

<Link
  href="/overlay/live/alert"
  className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
>
  Overlay alerta
</Link>
```

Se sua home já estiver ficando cheia de botões, você pode não adicionar esses links e acessar direto pela URL.

---

## 14. URLs para testar

Com o projeto rodando, acesse:

```txt
http://localhost:3000/overlay/live
```

Versão compacta:

```txt
http://localhost:3000/overlay/live/compact
```

Versão alerta:

```txt
http://localhost:3000/overlay/live/alert
```

---

## 15. Como usar no OBS

No OBS, adicione uma nova fonte:

```txt
Sources
    ↓
+
    ↓
Browser
```

Configure:

```txt
URL: http://localhost:3000/overlay/live
Width: 1920
Height: 1080
```

Para a versão compacta:

```txt
URL: http://localhost:3000/overlay/live/compact
Width: 1920
Height: 1080
```

Para a versão de alerta:

```txt
URL: http://localhost:3000/overlay/live/alert
Width: 1920
Height: 1080
```

Em produção, quando o projeto estiver na Vercel, a URL será algo como:

```txt
https://seu-projeto.vercel.app/overlay/live
```

---

## 16. Sobre fundo transparente

As páginas usam:

```tsx
bg-transparent
```

Isso ajuda no uso como overlay.

Porém, dependendo do OBS e do navegador embutido, pode aparecer fundo preto se alguma camada pai estiver com background.

Se isso acontecer, verifique:

- se o `body` global em `app/globals.css` não está forçando fundo preto;
- se o OBS está renderizando com transparência;
- se a rota não está usando wrapper com background.

Caso precise forçar transparência para overlays, você pode ajustar `app/globals.css`.

Exemplo:

```css
html,
body {
  background: transparent;
}
```

Mas atenção: isso pode afetar o site inteiro.

Uma alternativa melhor é criar um layout próprio para overlay futuramente.

---

## 17. Limitação desta etapa

Nesta etapa, o overlay ainda é mockado.

Ou seja:

```txt
os eventos não vêm do Firestore
os eventos não mudam automaticamente
não há animação baseada em evento real
não há controle pelo admin
não há fila de eventos
```

Mesmo assim, essa etapa é importante porque define a aparência e a estrutura visual.

---

## 18. Como conectar com Firestore futuramente

Depois, podemos criar uma coleção:

```txt
liveEvents
```

Exemplo de documento:

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

Aí o overlay usa `onSnapshot` para ouvir eventos em tempo real.

Fluxo futuro:

```txt
usuário abre pacote
        ↓
sistema gera evento em liveEvents
        ↓
overlay escuta liveEvents
        ↓
evento aparece na tela da live
```

---

## 19. Próxima etapa recomendada

Como você pediu a Etapa 10 diretamente, ela pode ser implementada agora.

Mas o fluxo ideal depois dela é voltar para:

```txt
Etapa 9 — Aplicar resultado da abertura na coleção
```

A Etapa 9 é essencial para transformar as cartas abertas em progresso real:

```txt
pato novo entra em userDucks
duplicata vira XP
carta XP aumenta XP
nível sobe
recompensa é liberada
Ravelbox cria pendingRewards
```

Depois disso, podemos fazer:

```txt
Etapa 11 — Conectar overlay com eventos reais do Firestore
```

---

## 20. O que essa etapa entrega

Ao final da Etapa 10, você terá:

```txt
rota /overlay/live
rota /overlay/live/compact
rota /overlay/live/alert
componentes visuais de overlay
destaque de evento principal
lista de eventos recentes
layout compatível com OBS
base para liveEvents futuramente
```
