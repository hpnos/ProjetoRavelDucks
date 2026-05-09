# Etapa 7 — Firebase: configuração, autenticação e base do Firestore

Nesta etapa vamos começar a tirar o projeto dos dados mockados e preparar a base real do sistema usando Firebase.

Até aqui as páginas funcionam com dados falsos. Agora vamos configurar:

```txt
Firebase
Firebase Authentication
Cloud Firestore
Variáveis de ambiente
Camada de conexão com o banco
Tipos principais do banco
Serviços iniciais
Seed manual de dados iniciais
```

A ideia desta etapa não é transformar tudo em Firebase de uma vez.

A ideia é criar a **fundação real** para que as próximas etapas possam salvar e buscar dados de verdade.

---

## 1. Objetivo da etapa

Criar a estrutura base para trabalhar com Firebase no projeto.

Nesta etapa vamos preparar:

- conexão com Firebase;
- autenticação por e-mail e senha;
- Firestore;
- arquivo de configuração seguro;
- tipos principais das entidades;
- serviços para acessar coleções;
- modelo inicial das coleções;
- página simples de login;
- estrutura para diferenciar usuário comum e admin;
- seed manual para criar dados iniciais.

---

## 2. O que muda a partir desta etapa?

Antes:

```txt
lib/mock-data.ts
lib/island-mock-data.ts
lib/collection-mock-data.ts
lib/packs-mock-data.ts
lib/admin-mock-data.ts
```

Agora vamos começar a preparar dados reais em coleções como:

```txt
users
ducks
cards
packs
grantedPacks
userDucks
islands
pendingRewards
packOpenings
```

Mas atenção:

> Não vamos apagar os mocks agora.

Os mocks ainda podem continuar no projeto até cada tela ser migrada para Firebase.

---

## 3. Criar projeto no Firebase Console

Acesse o Firebase Console e crie um projeto.

Nome sugerido:

```txt
ravel-ducks
```

Depois habilite:

```txt
Authentication
Firestore Database
```

No Authentication, habilite o provedor:

```txt
E-mail/senha
```

No Firestore, crie o banco em modo de teste inicialmente, apenas para desenvolvimento.

Depois vamos melhorar as regras de segurança.

---

## 4. Instalar o Firebase no projeto

No terminal, dentro da pasta do projeto:

```txt
D:\ProjetoRavel\ravel-ducks
```

Rode:

```bash
npm install firebase
```

---

## 5. Criar o arquivo `.env.local`

Na raiz do projeto, crie:

```txt
.env.local
```

Com este conteúdo:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
```

Você pega esses dados no Firebase Console:

```txt
Configurações do projeto
    ↓
Seus apps
    ↓
App Web
    ↓
Configuração do Firebase
```

---

## 6. Importante sobre `.env.local`

Confirme se seu `.gitignore` tem:

```txt
.env*.local
```

O Next.js normalmente já vem com isso.

Não suba `.env.local` para o GitHub.

---

## 7. Criar a configuração do Firebase

Crie a pasta:

```txt
lib/firebase
```

Dentro dela, crie o arquivo:

```txt
lib/firebase/client.ts
```

Com o conteúdo:

```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 8. Criar tipos principais do banco

Crie o arquivo:

```txt
types/database.ts
```

Com o conteúdo:

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

export type PackStatus = "available" | "opened" | "expired";

export type PendingRewardStatus = "pending" | "delivered" | "cancelled";

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface DuckDocument {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: Rarity;
  maxLevel: number;
  imageUrl?: string;
  gifUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DuckRewardDocument {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: CardType | "skin";
  description: string;
  imageUrl?: string;
  active: boolean;
}

export interface CardDocument {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackDocument {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrantedPackDocument {
  id: string;
  userId: string;
  packId: string;
  status: PackStatus;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
  createdAt: Date;
  openedAt?: Date;
}

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

export interface IslandDocument {
  id: string;
  userId: string;
  backgroundId?: string;
  public: boolean;
  visibleDucks: string[];
  equippedItems: {
    slotId: string;
    itemId: string;
    x?: number;
    y?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
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
```

---

## 9. Criar utilitário para converter datas do Firestore

O Firestore usa `Timestamp`, então é bom ter um helper.

Crie:

```txt
lib/firebase/firestore-utils.ts
```

Com o conteúdo:

```ts
import { Timestamp } from "firebase/firestore";

export function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return new Date();
}
```

---

## 10. Criar serviço de usuários

Crie a pasta:

```txt
services
```

Depois crie:

```txt
services/users-service.ts
```

Com o conteúdo:

```ts
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
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

  return snapshot.data() as AppUser;
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

## 11. Criar serviço de autenticação

Crie:

```txt
services/auth-service.ts
```

Com o conteúdo:

```ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { createUserProfile } from "./users-service";

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerWithEmail(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  await createUserProfile({
    id: credential.user.uid,
    email: input.email,
    displayName: input.displayName,
    username: input.username,
    role: "user",
  });

  return credential.user;
}

export async function loginWithEmail(input: LoginInput) {
  const credential = await signInWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}
```

---

## 12. Criar hook para usuário autenticado

Crie a pasta:

```txt
hooks
```

Depois crie:

```txt
hooks/use-auth-user.ts
```

Com o conteúdo:

```ts
"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
  };
}
```

---

## 13. Criar página de cadastro

Crie:

```txt
app/cadastro/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { registerWithEmail } from "@/services/auth-service";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      await registerWithEmail({
        displayName,
        username,
        email,
        password,
      });

      setMessage("Cadastro realizado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar conta. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-2 text-3xl font-black">Criar conta</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Crie sua conta para começar a colecionar patinhos.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Nome
            </label>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Ex: Guilherme"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Ex: guilherme"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              E-mail
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Senha
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          {message && (
            <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
              {message}
            </p>
          )}

          <button
            disabled={isLoading}
            className="rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-5 block text-center text-sm font-bold text-yellow-400"
        >
          Já tenho conta
        </Link>
      </section>
    </main>
  );
}
```

---

## 14. Criar página de login

Crie:

```txt
app/login/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { loginWithEmail } from "@/services/auth-service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      await loginWithEmail({
        email,
        password,
      });

      setMessage("Login realizado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao entrar. Verifique e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Ravel Ducks
        </p>

        <h1 className="mt-2 text-3xl font-black">Entrar</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Entre para acessar sua coleção, pacotes e ilha.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              E-mail
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Senha
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Sua senha"
              required
            />
          </div>

          {message && (
            <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
              {message}
            </p>
          )}

          <button
            disabled={isLoading}
            className="rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href="/cadastro"
          className="mt-5 block text-center text-sm font-bold text-yellow-400"
        >
          Criar conta
        </Link>
      </section>
    </main>
  );
}
```

---

## 15. Criar serviço inicial de patos

Crie:

```txt
services/ducks-service.ts
```

Com o conteúdo:

```ts
import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface CreateDuckInput {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  maxLevel: number;
}

export async function createDuck(input: CreateDuckInput) {
  const duckRef = doc(db, "ducks", input.id);

  await setDoc(duckRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

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

---

## 16. Criar página simples de seed

Esta página será usada apenas em desenvolvimento para criar dados iniciais no Firestore.

Crie:

```txt
app/admin/seed/page.tsx
```

Com o conteúdo:

```tsx
"use client";

import { useState } from "react";
import { createDuck } from "@/services/ducks-service";

export default function SeedPage() {
  const [message, setMessage] = useState("");

  async function handleSeedDucks() {
    try {
      setMessage("Criando patos...");

      await createDuck({
        id: "duck-junkrat",
        name: "Pato Junkrat",
        slug: "duck-junkrat",
        theme: "Junkrat",
        rarity: "epic",
        maxLevel: 10,
      });

      await createDuck({
        id: "duck-king",
        name: "Pato Rei",
        slug: "duck-king",
        theme: "Realeza",
        rarity: "legendary",
        maxLevel: 10,
      });

      await createDuck({
        id: "duck-basic",
        name: "Pato Clássico",
        slug: "duck-basic",
        theme: "Inicial",
        rarity: "common",
        maxLevel: 10,
      });

      setMessage("Patos iniciais criados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar dados iniciais.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Dados iniciais</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela apenas em desenvolvimento para criar dados iniciais no
          Firestore.
        </p>

        <button
          onClick={handleSeedDucks}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar patos iniciais
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

## 17. Regras iniciais do Firestore para desenvolvimento

No Firebase Console, vá em:

```txt
Firestore Database
    ↓
Rules
```

Para desenvolvimento, você pode usar temporariamente:

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

Isso significa:

```txt
Qualquer usuário logado pode ler e escrever.
```

Atenção:

> Essa regra é apenas para desenvolvimento.

Depois vamos restringir o admin.

---

## 18. Regras um pouco melhores para próxima fase

Mais tarde, a regra deve ser mais próxima disso:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
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

    match /cards/{cardId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /packs/{packId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    match /grantedPacks/{grantedPackId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow write: if isAdmin();
    }

    match /userDucks/{userDuckId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow write: if isAdmin();
    }

    match /islands/{islandId} {
      allow read: if resource.data.public == true || isAdmin();
      allow write: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    match /pendingRewards/{rewardId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

## 19. Atualizar página inicial com login e cadastro

Abra:

```txt
app/page.tsx
```

Adicione links para login e cadastro.

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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/login"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-yellow-300"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-zinc-950"
          >
            Criar conta
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

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/patos/duck-junkrat"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
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
            href="/admin"
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
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

## 20. Testar a etapa

Rode:

```bash
npm run dev
```

Teste:

```txt
http://localhost:3000/cadastro
http://localhost:3000/login
http://localhost:3000/admin/seed
```

Fluxo sugerido:

```txt
1. Criar conta em /cadastro
2. Entrar em /login
3. Acessar /admin/seed
4. Clicar em "Criar patos iniciais"
5. Ver no Firebase Console se a coleção ducks foi criada
```

---

## 21. Como tornar seu usuário admin

Depois de criar sua conta, vá no Firebase Console:

```txt
Firestore Database
    ↓
users
    ↓
seu documento de usuário
```

Altere o campo:

```txt
role: "user"
```

Para:

```txt
role: "admin"
```

Assim você já prepara o usuário para permissões futuras.

---

## 22. O que essa etapa entrega

Ao final da Etapa 7, você terá:

```txt
Firebase instalado
Configuração do Firebase no projeto
Variáveis de ambiente
Authentication por e-mail/senha
Cadastro de usuário
Login de usuário
Criação automática de perfil em users
Firestore configurado
Serviço inicial de usuários
Serviço inicial de patos
Página de seed para criar patos
Base para regras de segurança
```

---

## 23. Limitações desta etapa

Nesta etapa ainda temos:

- admin sem proteção real de rota;
- telas antigas ainda usando mocks;
- pacotes ainda não vêm do Firestore;
- coleção ainda não vem do Firestore;
- progresso ainda não vem do Firestore;
- ilhas ainda não vêm do Firestore;
- Ravelboxes ainda não vêm do Firestore.

Isso é normal.

A Etapa 7 cria a base real. As próximas etapas começam a migrar cada tela.

---

## 24. Próxima etapa

Depois da configuração do Firebase, a próxima etapa será:

```txt
Etapa 8 — Migrar pacotes para Firestore
```

Nessa próxima etapa vamos fazer:

```txt
admin liberar pacote para usuário
salvar em grantedPacks
usuário ver pacotes reais em /pacotes
abrir pacote real
registrar abertura em packOpenings
marcar pacote como opened
```
