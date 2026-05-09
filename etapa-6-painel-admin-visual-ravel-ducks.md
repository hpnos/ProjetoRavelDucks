# Etapa 6 — Painel Admin Visual

Nesta etapa vamos criar a base visual do painel administrativo do Ravel.

A ideia é permitir que o Ravel visualize como ele controlaria o sistema, mesmo antes de conectar Firebase.

Nesta etapa ainda vamos usar **dados mockados**, sem autenticação real e sem banco de dados.

---

## 1. Objetivo da etapa

Criar as principais telas do painel admin:

```txt
/admin
/admin/patos
/admin/cartas
/admin/pacotes
/admin/liberar-pacote
/admin/ravelboxes
```

O painel admin será usado para o Ravel:

- visualizar métricas gerais;
- ver patos cadastrados;
- ver cartas cadastradas;
- ver pacotes cadastrados;
- simular a liberação de pacote para usuário;
- ver Ravelboxes pendentes;
- ver histórico recente de ações.

---

## 2. Por que essa etapa é importante?

Até agora criamos a parte do usuário:

```txt
Etapa 1 - Progressão do pato
Etapa 2 - Ilha pública
Etapa 3 - Galeria de ilhas
Etapa 4 - Coleção
Etapa 5 - Pacotes sem pagamento
```

Agora precisamos criar a parte do Ravel.

Como o projeto não terá pagamento dentro da plataforma, o painel admin vira uma parte central do sistema.

O fluxo será:

```txt
Pessoa compra/ganha pacote durante a live
        ↓
Ravel entra no painel admin
        ↓
Seleciona usuário
        ↓
Seleciona pacote
        ↓
Libera pacote
        ↓
Usuário acessa /pacotes e abre
```

---

## 3. Estrutura de pastas

Como seu projeto está sem pasta `src`, vamos criar tudo na raiz:

```txt
ravel-ducks/
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
      AdminLayout.tsx
      AdminSidebar.tsx
      AdminStatCard.tsx
      AdminSectionHeader.tsx
      AdminDataTable.tsx
      AdminStatusBadge.tsx

  lib/
    admin-mock-data.ts

  types/
    admin.ts
```

---

## 4. Criar os tipos do admin

Crie o arquivo:

```txt
types/admin.ts
```

Com o conteúdo:

```ts
export type AdminStatus = "active" | "inactive" | "pending" | "delivered";

export interface AdminDuck {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  theme: string;
  maxLevel: number;
  status: AdminStatus;
}

export interface AdminCard {
  id: string;
  name: string;
  type:
    | "duck"
    | "duck_xp"
    | "island_item"
    | "accessory"
    | "border"
    | "pin"
    | "digital_art"
    | "ravelbox";
  rarity: "common" | "rare" | "epic" | "legendary";
  relatedDuck?: string;
  status: AdminStatus;
}

export interface AdminPack {
  id: string;
  name: string;
  cardsQuantity: number;
  source: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  status: AdminStatus;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  totalDucks: number;
  availablePacks: number;
}

export interface AdminRavelbox {
  id: string;
  username: string;
  source: string;
  rewardName: string;
  status: "pending" | "delivered";
  createdAt: string;
}

export interface AdminRecentAction {
  id: string;
  description: string;
  createdAt: string;
  type: "pack" | "duck" | "ravelbox" | "reward";
}
```

---

## 5. Criar os dados mockados do admin

Crie o arquivo:

```txt
lib/admin-mock-data.ts
```

Com o conteúdo:

```ts
import {
  AdminCard,
  AdminDuck,
  AdminPack,
  AdminRecentAction,
  AdminRavelbox,
  AdminUser,
} from "@/types/admin";

export const adminDucks: AdminDuck[] = [
  {
    id: "duck-junkrat",
    name: "Pato Junkrat",
    rarity: "epic",
    theme: "Junkrat",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-king",
    name: "Pato Rei",
    rarity: "legendary",
    theme: "Realeza",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-shadow",
    name: "Pato Sombra",
    rarity: "legendary",
    theme: "Noturno",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-basic",
    name: "Pato Clássico",
    rarity: "common",
    theme: "Inicial",
    maxLevel: 10,
    status: "active",
  },
];

export const adminCards: AdminCard[] = [
  {
    id: "card-duck-junkrat",
    name: "Pato Junkrat",
    type: "duck",
    rarity: "epic",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-xp-junkrat",
    name: "XP Junkrat +100",
    type: "duck_xp",
    rarity: "rare",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-border-junkrat",
    name: "Borda Junkrat",
    type: "border",
    rarity: "rare",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-ravelbox",
    name: "Ravelbox",
    type: "ravelbox",
    rarity: "legendary",
    status: "active",
  },
];

export const adminPacks: AdminPack[] = [
  {
    id: "pack-live",
    name: "Pacote da Live",
    cardsQuantity: 4,
    source: "live_purchase",
    status: "active",
  },
  {
    id: "pack-event",
    name: "Pacote Evento Especial",
    cardsQuantity: 3,
    source: "event_reward",
    status: "active",
  },
  {
    id: "pack-bonus",
    name: "Pacote Bônus Manual",
    cardsQuantity: 3,
    source: "manual_bonus",
    status: "active",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "user-ravel",
    username: "ravel",
    displayName: "Ravel",
    totalDucks: 7,
    availablePacks: 1,
  },
  {
    id: "user-levi",
    username: "levi",
    displayName: "Levi",
    totalDucks: 4,
    availablePacks: 0,
  },
  {
    id: "user-guilherme",
    username: "guilherme",
    displayName: "Guilherme",
    totalDucks: 10,
    availablePacks: 2,
  },
];

export const adminRavelboxes: AdminRavelbox[] = [
  {
    id: "ravelbox-001",
    username: "guilherme",
    source: "Pato Sombra nível 6",
    rewardName: "Ravelbox",
    status: "pending",
    createdAt: "2026-05-09",
  },
  {
    id: "ravelbox-002",
    username: "ravel",
    source: "Pato Junkrat nível 10",
    rewardName: "Ravelbox Final",
    status: "pending",
    createdAt: "2026-05-09",
  },
  {
    id: "ravelbox-003",
    username: "levi",
    source: "Evento da Live",
    rewardName: "Ravelbox Evento",
    status: "delivered",
    createdAt: "2026-05-08",
  },
];

export const adminRecentActions: AdminRecentAction[] = [
  {
    id: "action-001",
    description: "Pacote da Live liberado para Guilherme",
    createdAt: "2026-05-09 20:14",
    type: "pack",
  },
  {
    id: "action-002",
    description: "Ravelbox desbloqueada por Ravel",
    createdAt: "2026-05-09 20:10",
    type: "ravelbox",
  },
  {
    id: "action-003",
    description: "Pato Junkrat cadastrado no sistema",
    createdAt: "2026-05-09 19:45",
    type: "duck",
  },
  {
    id: "action-004",
    description: "Recompensa de nível 8 configurada",
    createdAt: "2026-05-09 19:30",
    type: "reward",
  },
];
```

---

## 6. Criar o componente `AdminStatusBadge`

Crie o arquivo:

```txt
components/admin/AdminStatusBadge.tsx
```

Com o conteúdo:

```tsx
import { AdminStatus } from "@/types/admin";

interface AdminStatusBadgeProps {
  status: AdminStatus | "delivered";
}

const statusLabel = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  delivered: "Entregue",
};

const statusStyle = {
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  inactive: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  pending: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
  delivered: "border-sky-400/40 bg-sky-400/10 text-sky-300",
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

## 7. Criar o componente `AdminStatCard`

Crie o arquivo:

```txt
components/admin/AdminStatCard.tsx
```

Com o conteúdo:

```tsx
interface AdminStatCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>

      {helper && <p className="mt-2 text-sm text-zinc-500">{helper}</p>}
    </div>
  );
}
```

---

## 8. Criar o componente `AdminSectionHeader`

Crie o arquivo:

```txt
components/admin/AdminSectionHeader.tsx
```

Com o conteúdo:

```tsx
interface AdminSectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
}

export function AdminSectionHeader({
  title,
  description,
  actionLabel,
}: AdminSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Painel Admin
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">{title}</h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          {description}
        </p>
      </div>

      {actionLabel && (
        <button className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300">
          {actionLabel}
        </button>
      )}
    </header>
  );
}
```

---

## 9. Criar o componente `AdminSidebar`

Crie o arquivo:

```txt
components/admin/AdminSidebar.tsx
```

Com o conteúdo:

```tsx
import Link from "next/link";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/patos",
    label: "Patos",
  },
  {
    href: "/admin/cartas",
    label: "Cartas",
  },
  {
    href: "/admin/pacotes",
    label: "Pacotes",
  },
  {
    href: "/admin/liberar-pacote",
    label: "Liberar pacote",
  },
  {
    href: "/admin/ravelboxes",
    label: "Ravelboxes",
  },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl lg:sticky lg:top-6 lg:h-fit">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Admin</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <Link
          href="/"
          className="block rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
```

---

## 10. Criar o componente `AdminLayout`

Crie o arquivo:

```txt
components/admin/AdminLayout.tsx
```

Com o conteúdo:

```tsx
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </main>
  );
}
```

---

## 11. Criar o componente `AdminDataTable`

Crie o arquivo:

```txt
components/admin/AdminDataTable.tsx
```

Com o conteúdo:

```tsx
import { ReactNode } from "react";

interface AdminDataTableProps {
  headers: string[];
  children: ReactNode;
}

export function AdminDataTable({ headers, children }: AdminDataTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">{children}</tbody>
        </table>
      </div>
    </section>
  );
}
```

---

## 12. Criar a página `/admin`

Crie o arquivo:

```txt
app/admin/page.tsx
```

Com o conteúdo:

```tsx
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  adminCards,
  adminDucks,
  adminPacks,
  adminRavelboxes,
  adminRecentActions,
  adminUsers,
} from "@/lib/admin-mock-data";

export default function AdminDashboardPage() {
  const pendingRavelboxes = adminRavelboxes.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Dashboard"
        description="Visão geral do sistema Ravel Ducks, com cadastros, pacotes, usuários e recompensas pendentes."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Patos" value={adminDucks.length} />
        <AdminStatCard label="Cartas" value={adminCards.length} />
        <AdminStatCard label="Pacotes" value={adminPacks.length} />
        <AdminStatCard label="Usuários" value={adminUsers.length} />
        <AdminStatCard label="Ravelboxes pendentes" value={pendingRavelboxes} />
      </section>

      <AdminDataTable headers={["Ação recente", "Tipo", "Data"]}>
        {adminRecentActions.map((action) => (
          <tr key={action.id}>
            <td className="px-5 py-4 text-sm font-semibold text-white">
              {action.description}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">{action.type}</td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {action.createdAt}
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 13. Criar a página `/admin/patos`

Crie o arquivo:

```txt
app/admin/patos/page.tsx
```

Com o conteúdo:

```tsx
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminDucks } from "@/lib/admin-mock-data";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export default function AdminDucksPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Patos"
        description="Gerencie os patinhos colecionáveis que podem ser desbloqueados pelos usuários."
        actionLabel="Novo pato"
      />

      <AdminDataTable headers={["Nome", "Tema", "Raridade", "Nível máximo", "Status"]}>
        {adminDucks.map((duck) => (
          <tr key={duck.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              {duck.name}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">{duck.theme}</td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {rarityLabel[duck.rarity]}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {duck.maxLevel}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={duck.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 14. Criar a página `/admin/cartas`

Crie o arquivo:

```txt
app/admin/cartas/page.tsx
```

Com o conteúdo:

```tsx
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminCards } from "@/lib/admin-mock-data";

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
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Cartas"
        description="Gerencie as cartas que podem sair nos pacotes liberados durante a live."
        actionLabel="Nova carta"
      />

      <AdminDataTable headers={["Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
        {adminCards.map((card) => (
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
              {card.relatedDuck ?? "-"}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={card.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 15. Criar a página `/admin/pacotes`

Crie o arquivo:

```txt
app/admin/pacotes/page.tsx
```

Com o conteúdo:

```tsx
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminPacks } from "@/lib/admin-mock-data";

const sourceLabel = {
  live_purchase: "Live",
  event_reward: "Evento",
  manual_bonus: "Bônus manual",
  admin: "Admin",
};

export default function AdminPacksPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Pacotes"
        description="Gerencie os tipos de pacotes que podem ser liberados para os usuários."
        actionLabel="Novo pacote"
      />

      <AdminDataTable headers={["Nome", "Cartas", "Origem", "Status"]}>
        {adminPacks.map((pack) => (
          <tr key={pack.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              {pack.name}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {pack.cardsQuantity}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {sourceLabel[pack.source]}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={pack.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 16. Criar a página `/admin/liberar-pacote`

Crie o arquivo:

```txt
app/admin/liberar-pacote/page.tsx
```

Com o conteúdo:

```tsx
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { adminPacks, adminUsers } from "@/lib/admin-mock-data";

export default function AdminGrantPackPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Liberar pacote"
        description="Simule a liberação de um pacote para um usuário. Futuramente essa ação criará um pacote disponível na tela /pacotes do usuário."
      />

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <form className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Usuário
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              {adminUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName} (@{user.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Pacote
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              {adminPacks.map((pack) => (
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

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              <option value="live_purchase">Compra/combinação na live</option>
              <option value="event_reward">Recompensa de evento</option>
              <option value="manual_bonus">Bônus manual</option>
              <option value="admin">Ajuste admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Observação
            </label>

            <textarea
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Ex: Pacote liberado após participação no evento da live."
            />
          </div>

          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
            Nesta versão visual, o botão ainda não salva no banco. Na etapa do
            Firebase, essa ação criará um registro em grantedPacks.
          </div>

          <button
            type="button"
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

## 17. Criar a página `/admin/ravelboxes`

Crie o arquivo:

```txt
app/admin/ravelboxes/page.tsx
```

Com o conteúdo:

```tsx
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminRavelboxes } from "@/lib/admin-mock-data";

export default function AdminRavelboxesPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Ravelboxes"
        description="Acompanhe as Ravelboxes desbloqueadas pelos usuários e marque quais já foram entregues."
      />

      <AdminDataTable headers={["Usuário", "Origem", "Recompensa", "Data", "Status"]}>
        {adminRavelboxes.map((reward) => (
          <tr key={reward.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              @{reward.username}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.source}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.rewardName}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.createdAt}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={reward.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
```

---

## 18. Atualizar a página inicial

Abra:

```txt
app/page.tsx
```

Adicione um link para `/admin`.

Você pode substituir o conteúdo por este:

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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Pato
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

          <Link
            href="/admin"
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## 19. Rodar o projeto

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
http://localhost:3000/admin
```

Teste também:

```txt
http://localhost:3000/admin/patos
http://localhost:3000/admin/cartas
http://localhost:3000/admin/pacotes
http://localhost:3000/admin/liberar-pacote
http://localhost:3000/admin/ravelboxes
```

---

## 20. O que essa etapa entrega

Ao final da Etapa 6, você terá:

```txt
Dashboard admin visual
Menu lateral admin
Tela de patos
Tela de cartas
Tela de pacotes
Tela para liberar pacote
Tela de Ravelboxes pendentes
Tabela reutilizável
Cards de estatísticas
Base visual para o painel do Ravel
```

---

## 21. Limitações desta etapa

Nesta etapa ainda temos:

- dados mockados;
- sem autenticação admin;
- sem Firebase;
- botões não salvam;
- formulários não persistem;
- pacote liberado ainda não aparece de verdade em /pacotes;
- Ravelbox ainda não muda status para entregue.

Essas limitações serão resolvidas quando conectarmos o Firebase.

---

## 22. Próxima etapa

Depois do Painel Admin Visual, a próxima etapa será:

```txt
Etapa 7 — Firebase
```

Nessa etapa vamos começar a conectar o sistema com dados reais.

A Etapa 7 deve incluir:

```txt
configuração do Firebase
Firebase Auth
Firestore
coleção users
coleção ducks
coleção cards
coleção packs
coleção grantedPacks
coleção userDucks
coleção islands
coleção pendingRewards
```

O objetivo será tirar o sistema dos mocks e começar a salvar dados reais.
