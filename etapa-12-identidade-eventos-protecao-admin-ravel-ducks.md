# Etapa 12 — Melhorar identidade dos eventos e proteger área admin

Nesta etapa vamos fazer dois ajustes importantes depois que o overlay já está atualizando com eventos reais:

1. Fazer os eventos da live mostrarem o `displayName` e `username` reais do usuário.
2. Proteger melhor as rotas/admin e as regras do Firestore.

Na Etapa 11, alguns eventos ainda aparecem como:

```txt
Usuário
@user
```

Isso aconteceu porque os serviços que geram eventos ainda não estão buscando o perfil real do usuário na coleção `users`.

Agora vamos corrigir isso.

---

## 1. Objetivo da etapa

Implementar:

- busca do perfil real do usuário em `users`;
- eventos com `displayName` e `username` reais;
- helper para criar eventos usando `userId`;
- proteção visual das páginas admin;
- hook para verificar se usuário é admin;
- ajustes nas regras do Firestore;
- proteção básica das páginas de seed;
- melhoria na sidebar admin;
- base para remover mocks de usuários no admin futuramente.

---

## 2. O que vamos corrigir

Hoje, em alguns pontos, os eventos estão sendo criados assim:

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

Depois desta etapa, será algo assim:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "pack_opened",
  title: "Pacote aberto!",
  description: `Guilherme abriu um pacote com 4 cartas.`,
  rarity: "rare",
  icon: "🎴",
});
```

E o serviço buscará automaticamente:

```txt
users/{userId}.displayName
users/{userId}.username
```

---

## 3. Estrutura de arquivos

Crie ou atualize:

```txt
services/
  users-service.ts
  live-events-service.ts
  pack-openings-service.ts
  pack-results-service.ts

hooks/
  use-user-profile.ts
  use-admin-user.ts

components/
  admin/
    AdminGuard.tsx
    AdminSidebar.tsx

app/
  admin/
    layout.tsx ou usar AdminGuard diretamente nas páginas
```

Observação:

Se você ainda não quiser criar `app/admin/layout.tsx`, pode envolver cada página admin com `AdminGuard`.

---

## 4. Atualizar `users-service.ts`

Abra:

```txt
services/users-service.ts
```

Confirme se já existe a função:

```ts
export async function getUserProfile(userId: string)
```

Se ela estiver retornando `snapshot.data() as AppUser`, podemos melhorar o tratamento de datas.

Substitua ou ajuste para:

```ts
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { AppUser, UserRole } from "@/types/database";

interface CreateUserProfileInput {
  id: string;
  email: string;
  displayName: string;
  username: string;
  role?: UserRole;
}

export async function createUserProfile(input: CreateUserProfileInput) {
  const userRef = doc(db, "users", input.id);

  await setDoc(userRef, {
    id: input.id,
    email: input.email,
    displayName: input.displayName,
    username: input.username,
    role: input.role ?? "user",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as AppUser;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}
```

---

## 5. Atualizar `live-events-service.ts`

Abra:

```txt
services/live-events-service.ts
```

Adicione este import:

```ts
import { getUserProfile } from "./users-service";
```

Agora adicione uma nova função:

```ts
interface CreateLiveEventForUserInput {
  userId: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
}

export async function createLiveEventForUser(input: CreateLiveEventForUserInput) {
  const userProfile = await getUserProfile(input.userId);

  await createLiveEvent({
    userId: input.userId,
    username: userProfile?.username ?? "user",
    displayName: userProfile?.displayName ?? "Usuário",
    type: input.type,
    title: input.title,
    description: input.description,
    rarity: input.rarity,
    icon: input.icon,
  });
}
```

O arquivo ficará com duas formas de criar eventos:

```txt
createLiveEvent          -> evento manual, informando username/displayName
createLiveEventForUser   -> evento automático, usando userId
```

---

## 6. Atualizar eventos de abertura de pacote

Abra:

```txt
services/pack-openings-service.ts
```

Troque o import:

```ts
import { createLiveEvent } from "./live-events-service";
```

Por:

```ts
import { createLiveEventForUser } from "./live-events-service";
```

Agora procure o evento de pacote aberto.

Antes:

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

Depois:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "pack_opened",
  title: "Pacote aberto!",
  description: `Um pacote foi aberto e revelou ${cards.length} cartas.`,
  rarity: "rare",
  icon: "🎴",
});
```

Agora procure os eventos de carta rara.

Antes:

```ts
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
```

Depois:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "rare_card",
  title:
    card.rarity === "legendary"
      ? "Carta lendária revelada!"
      : "Carta épica revelada!",
  description: `A carta ${card.name} apareceu na abertura do pacote.`,
  rarity: card.rarity,
  icon: card.rarity === "legendary" ? "👑" : "✨",
});
```

---

## 7. Atualizar eventos em `pack-results-service.ts`

Abra:

```txt
services/pack-results-service.ts
```

Troque:

```ts
import { createLiveEvent } from "./live-events-service";
```

Por:

```ts
import { createLiveEventForUser } from "./live-events-service";
```

Agora substitua os eventos.

### Evento de pato desbloqueado

Antes:

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

Depois:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "duck_unlocked",
  title: "Novo pato desbloqueado!",
  description: `${card.name} entrou para a coleção.`,
  rarity: card.rarity,
  icon: "🦆",
});
```

### Evento de Ravelbox

Antes:

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

Depois:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "ravelbox",
  title: "Ravelbox desbloqueada!",
  description: `${card.name} foi adicionada como recompensa pendente.`,
  rarity: "legendary",
  icon: "🎁",
});
```

### Evento de level up

Antes:

```ts
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
```

Depois:

```ts
await createLiveEventForUser({
  userId: input.userId,
  type: "level_up",
  title: "Pato subiu de nível!",
  description: `Um pato subiu para o nível ${result.newLevel}.`,
  rarity: "epic",
  icon: "✨",
});
```

---

## 8. Criar hook `use-user-profile`

Crie:

```txt
hooks/use-user-profile.ts
```

Com o conteúdo:

```ts
"use client";

import { useEffect, useState } from "react";
import { AppUser } from "@/types/database";
import { getUserProfile } from "@/services/users-service";

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setProfile(null);
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);

        const userProfile = await getUserProfile(userId);

        setProfile(userProfile);
      } catch (error) {
        console.error(error);
        setProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [userId]);

  return {
    profile,
    isLoadingProfile,
  };
}
```

---

## 9. Criar hook `use-admin-user`

Crie:

```txt
hooks/use-admin-user.ts
```

Com o conteúdo:

```ts
"use client";

import { useAuthUser } from "./use-auth-user";
import { useUserProfile } from "./use-user-profile";

export function useAdminUser() {
  const { user, isLoading: isLoadingAuth, isAuthenticated } = useAuthUser();
  const { profile, isLoadingProfile } = useUserProfile(user?.uid);

  const isLoading = isLoadingAuth || isLoadingProfile;
  const isAdmin = profile?.role === "admin";

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
  };
}
```

---

## 10. Criar componente `AdminGuard`

Crie:

```txt
components/admin/AdminGuard.tsx
```

Com o conteúdo:

```tsx
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAdminUser } from "@/hooks/use-admin-user";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isLoading, isAuthenticated, isAdmin, profile } = useAdminUser();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Verificando permissões...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Acesso restrito</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Você precisa estar logado para acessar o painel admin.
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

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <section className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black">Sem permissão</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Sua conta está logada como{" "}
            <strong className="text-white">{profile?.displayName}</strong>, mas
            não possui permissão de admin.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Voltar ao site
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
```

---

## 11. Proteger `AdminLayout`

Abra:

```txt
components/admin/AdminLayout.tsx
```

Envolva o layout com `AdminGuard`.

Exemplo:

```tsx
import { ReactNode } from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />

          <div className="flex min-w-0 flex-col gap-6">{children}</div>
        </div>
      </main>
    </AdminGuard>
  );
}
```

Agora todas as páginas que usam `AdminLayout` ficam protegidas visualmente.

---

## 12. Tornar seu usuário admin

Para conseguir acessar o painel, você precisa marcar seu usuário como admin.

No Firebase Console:

```txt
Firestore Database
    ↓
users
    ↓
seu UID
```

Altere:

```txt
role: "user"
```

Para:

```txt
role: "admin"
```

Depois recarregue a página `/admin`.

---

## 13. Melhorar sidebar com dados do admin logado

Abra:

```txt
components/admin/AdminSidebar.tsx
```

Adicione:

```tsx
"use client";

import Link from "next/link";
import { useAdminUser } from "@/hooks/use-admin-user";
```

Depois dentro do componente:

```tsx
const { profile } = useAdminUser();
```

E exiba:

```tsx
{profile && (
  <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
      Logado como
    </p>
    <p className="mt-1 text-sm font-black text-white">
      {profile.displayName}
    </p>
    <p className="text-xs text-zinc-500">@{profile.username}</p>
  </div>
)}
```

Exemplo completo simplificado:

```tsx
"use client";

import Link from "next/link";
import { useAdminUser } from "@/hooks/use-admin-user";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/patos", label: "Patos" },
  { href: "/admin/cartas", label: "Cartas" },
  { href: "/admin/pacotes", label: "Pacotes" },
  { href: "/admin/liberar-pacote", label: "Liberar pacote" },
  { href: "/admin/ravelboxes", label: "Ravelboxes" },
  { href: "/admin/live-events", label: "Eventos da live" },
  { href: "/admin/live-events-test", label: "Teste de eventos" },
];

export function AdminSidebar() {
  const { profile } = useAdminUser();

  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl lg:sticky lg:top-6 lg:h-fit">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Admin</h2>
      </div>

      {profile && (
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Logado como
          </p>
          <p className="mt-1 text-sm font-black text-white">
            {profile.displayName}
          </p>
          <p className="text-xs text-zinc-500">@{profile.username}</p>
        </div>
      )}

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

## 14. Melhorar regras do Firestore

Agora que existe admin visual, podemos melhorar regras.

No Firebase Console, vá em:

```txt
Firestore Database
    ↓
Rules
```

Use uma versão parecida com esta para desenvolvimento mais seguro:

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

Atenção:

Esta regra ainda permite alguns writes do usuário em coleções sensíveis porque parte da lógica está rodando no frontend.

Em produção, o ideal seria mover operações críticas para backend/Cloud Functions.

---

## 15. Testar identidade real nos eventos

Fluxo:

```txt
1. Faça login com seu usuário.
2. Confirme que o documento users/{uid} tem displayName e username.
3. Abra /overlay/live em uma aba.
4. Libere um pacote para seu UID.
5. Abra o pacote em /pacotes.
6. Veja se o overlay mostra seu nome real.
```

Resultado esperado:

```txt
Antes:
Usuário abriu um pacote

Agora:
Guilherme abriu um pacote
```

---

## 16. Testar proteção admin

### Teste 1 — sem login

Saia da conta e acesse:

```txt
/admin
```

Resultado esperado:

```txt
Acesso restrito
```

### Teste 2 — usuário comum

Faça login com usuário `role: "user"` e acesse:

```txt
/admin
```

Resultado esperado:

```txt
Sem permissão
```

### Teste 3 — admin

Mude o campo no Firestore:

```txt
role: "admin"
```

Acesse:

```txt
/admin
```

Resultado esperado:

```txt
Dashboard admin
```

---

## 17. Verificar regras do Firestore

Teste:

```txt
1. Usuário comum não deve conseguir criar pato em /admin/seed.
2. Usuário comum não deve conseguir liberar pacote.
3. Admin deve conseguir criar seeds e liberar pacotes.
4. Overlay deve conseguir ler liveEvents sem login.
```

---

## 18. O que essa etapa entrega

Ao final da Etapa 12, você terá:

```txt
eventos da live com displayName real
eventos da live com username real
serviço createLiveEventForUser
AdminGuard protegendo o painel visual
hook useUserProfile
hook useAdminUser
sidebar admin mostrando usuário logado
regras Firestore mais seguras
rotas admin protegidas visualmente
```

---

## 19. Limitações desta etapa

Ainda temos:

```txt
proteção admin no frontend não substitui backend seguro
operações críticas ainda rodam no cliente
algumas regras ainda são permissivas para permitir funcionamento
não há Cloud Functions
adminUsers em alguns lugares ainda pode estar mockado
seed pages ainda existem
```

---

## 20. Próxima etapa

A próxima etapa recomendada será:

```txt
Etapa 13 — Migrar painel admin para dados reais
```

Nela vamos tirar o admin dos mocks e fazer:

```txt
/admin/patos ler ducks reais
/admin/cartas ler cards reais
/admin/pacotes ler packs reais
/admin/ravelboxes ler pendingRewards reais
/admin/liberar-pacote listar users reais
admin criar/editar patos, cartas e pacotes
```
