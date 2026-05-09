# Etapa 14.1 — Upload de imagens para cartas, patos e pacotes

Esta etapa é um ajuste importante dentro da Etapa 14.

Agora que o painel admin já terá formulários reais para criação de patos, cartas, pacotes e recompensas, precisamos permitir o envio de imagens.

Isso é essencial porque o projeto terá artes feitas por ilustrador, como cartas personalizadas.

A imagem da carta, do pato e do pacote não deve ficar apenas em mock ou emoji. Ela deve ser enviada para o Firebase Storage e a URL deve ser salva no Firestore.

---

## 1. Objetivo da etapa

Implementar upload de imagem no painel admin para:

```txt
cartas
patos
pacotes
```

O fluxo será:

```txt
Admin seleciona imagem
        ↓
Sistema mostra preview
        ↓
Admin envia o formulário
        ↓
Imagem sobe para Firebase Storage
        ↓
Firebase retorna downloadURL
        ↓
Firestore salva imageUrl e imagePath
        ↓
Telas passam a usar a imagem real
```

---

## 2. Por que essa etapa é importante?

O projeto Ravel Ducks depende muito do visual das cartas.

As cartas terão ilustrações próprias. Então o cadastro de carta precisa aceitar uma arte, por exemplo:

```txt
Carta Apolo
Arte da carta
Tipo
Raridade
Descrição
Pato relacionado
```

Também precisamos de imagem para:

```txt
Pato na coleção
Pato na ilha
Pacote na tela /pacotes
Carta revelada ao abrir pacote
```

---

## 3. O que será alterado

Vamos criar:

```txt
lib/firebase/storage.ts
services/upload-service.ts
components/admin/AdminImageUpload.tsx
```

Vamos atualizar:

```txt
types/database.ts
services/cards-service.ts
services/ducks-service.ts
services/packs-service.ts
app/admin/cartas/nova/page.tsx
app/admin/patos/novo/page.tsx
app/admin/pacotes/novo/page.tsx
components/packs/RealReceivedCard.tsx
components/packs/RealPackCard.tsx
```

Opcionalmente também podemos atualizar:

```txt
app/admin/cartas/page.tsx
app/admin/patos/page.tsx
app/admin/pacotes/page.tsx
app/colecao/page.tsx
```

---

## 4. Configurar Firebase Storage no Firebase Console

No Firebase Console, acesse:

```txt
Build
  ↓
Storage
```

Clique em:

```txt
Get started
```

Crie o bucket de Storage.

Durante desenvolvimento, você pode usar regras simples para permitir upload apenas de usuários logados.

---

## 5. Regras temporárias do Firebase Storage

No Firebase Console, vá em:

```txt
Storage
  ↓
Rules
```

Use temporariamente:

```txt
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Isso permite:

```txt
qualquer pessoa pode ver imagens
somente usuário logado pode enviar imagem
```

Futuramente, o ideal é restringir escrita apenas para admin.

---

## 6. Criar configuração do Storage

Crie o arquivo:

```txt
lib/firebase/storage.ts
```

Com o conteúdo:

```ts
import { getStorage } from "firebase/storage";
import { auth } from "./client";
import { db } from "./client";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const storage = getStorage(app);
```

### Alternativa mais limpa

Se em `lib/firebase/client.ts` você já exporta o app, prefira fazer assim.

Atualize `lib/firebase/client.ts` para exportar `app`:

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

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

Depois crie `lib/firebase/storage.ts` assim:

```ts
import { getStorage } from "firebase/storage";
import { app } from "./client";

export const storage = getStorage(app);
```

Essa é a opção recomendada.

---

## 7. Criar serviço de upload

Crie:

```txt
services/upload-service.ts
```

Com o conteúdo:

```ts
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/storage";

export type UploadFolder = "cards" | "ducks" | "ducks/gifs" | "packs";

interface UploadImageInput {
  file: File;
  folder: UploadFolder;
  fileName: string;
}

export interface UploadImageResult {
  imageUrl: string;
  imagePath: string;
}

export async function uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
  const extension = input.file.name.split(".").pop() ?? "png";

  const safeFileName = input.fileName
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("/", "-");

  const imagePath = `${input.folder}/${safeFileName}.${extension}`;

  const imageRef = ref(storage, imagePath);

  await uploadBytes(imageRef, input.file);

  const imageUrl = await getDownloadURL(imageRef);

  return {
    imageUrl,
    imagePath,
  };
}
```

---

## 8. Atualizar tipos em `types/database.ts`

Abra:

```txt
types/database.ts
```

Atualize os tipos principais.

### `DuckDocument`

Adicione:

```ts
imageUrl?: string;
imagePath?: string;
gifUrl?: string;
gifPath?: string;
```

Exemplo:

```ts
export interface DuckDocument {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: Rarity;
  maxLevel: number;
  imageUrl?: string;
  imagePath?: string;
  gifUrl?: string;
  gifPath?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `CardDocument`

Adicione:

```ts
imageUrl?: string;
imagePath?: string;
```

Exemplo:

```ts
export interface CardDocument {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
  imageUrl?: string;
  imagePath?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `PackDocument`

Adicione:

```ts
imageUrl?: string;
imagePath?: string;
```

Exemplo:

```ts
export interface PackDocument {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
  imageUrl?: string;
  imagePath?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 9. Atualizar `cards-service.ts`

Abra:

```txt
services/cards-service.ts
```

Atualize a interface de criação.

Antes pode estar assim:

```ts
interface CreateCardInput {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
}
```

Atualize para:

```ts
interface CreateCardInput {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
  imageUrl?: string;
  imagePath?: string;
}
```

A função `createCard` pode continuar assim:

```ts
export async function createCard(input: CreateCardInput) {
  const cardRef = doc(db, "cards", input.id);

  await setDoc(cardRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
```

Como ela usa `...input`, já salva `imageUrl` e `imagePath`.

---

## 10. Atualizar `ducks-service.ts`

Abra:

```txt
services/ducks-service.ts
```

Atualize a interface de criação.

Antes:

```ts
interface CreateDuckInput {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  maxLevel: number;
}
```

Depois:

```ts
interface CreateDuckInput {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  maxLevel: number;
  imageUrl?: string;
  imagePath?: string;
  gifUrl?: string;
  gifPath?: string;
}
```

A função pode continuar com:

```ts
await setDoc(duckRef, {
  ...input,
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

---

## 11. Atualizar `packs-service.ts`

Abra:

```txt
services/packs-service.ts
```

Atualize a interface de criação.

Antes:

```ts
interface CreatePackInput {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
}
```

Depois:

```ts
interface CreatePackInput {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
  imageUrl?: string;
  imagePath?: string;
}
```

A função pode continuar usando:

```ts
await setDoc(packRef, {
  ...input,
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

---

## 12. Criar componente `AdminImageUpload`

Crie:

```txt
components/admin/AdminImageUpload.tsx
```

Com o conteúdo:

```tsx
"use client";

import Image from "next/image";
import { ChangeEvent, useMemo } from "react";

interface AdminImageUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  helper?: string;
  accept?: string;
}

export function AdminImageUpload({
  label,
  file,
  onChange,
  helper,
  accept = "image/png,image/jpeg,image/jpg,image/webp,image/gif",
}: AdminImageUploadProps) {
  const previewUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    onChange(selectedFile);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-sm file:font-black file:text-zinc-950 hover:file:bg-yellow-300"
        />

        {helper && (
          <p className="mt-2 text-xs text-zinc-500">
            {helper}
          </p>
        )}

        {previewUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="relative h-72 w-full">
              <Image
                src={previewUrl}
                alt="Preview da imagem"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}

        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-3 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
          >
            Remover imagem
          </button>
        )}
      </div>
    </div>
  );
}
```

### Observação sobre `Image`

Como o preview usa `blob:`, colocamos:

```tsx
unoptimized
```

Se preferir evitar configuração do Next Image, pode usar `<img>`.

Alternativa simples:

```tsx
<img src={previewUrl} alt="Preview da imagem" className="h-72 w-full object-contain" />
```

---

## 13. Atualizar `app/admin/cartas/nova/page.tsx`

Abra:

```txt
app/admin/cartas/nova/page.tsx
```

Adicione imports:

```ts
import { AdminImageUpload } from "@/components/admin/AdminImageUpload";
import { uploadImage } from "@/services/upload-service";
```

Adicione estado:

```ts
const [imageFile, setImageFile] = useState<File | null>(null);
const [isSaving, setIsSaving] = useState(false);
```

No formulário, adicione antes do botão:

```tsx
<AdminImageUpload
  label="Arte da carta"
  file={imageFile}
  onChange={setImageFile}
  helper="Envie a arte final da carta. Recomendado: PNG ou WEBP em alta qualidade."
/>
```

Atualize `handleSubmit`.

Antes deve estar parecido com:

```ts
await createCard({
  id,
  name,
  description,
  type: type as CardType,
  rarity: rarity as Rarity,
  duckId: duckId || undefined,
  xpAmount: Number(xpAmount) > 0 ? Number(xpAmount) : undefined,
});
```

Depois use:

```ts
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    setIsSaving(true);
    setMessage("");

    let imageUrl: string | undefined;
    let imagePath: string | undefined;

    if (imageFile) {
      const upload = await uploadImage({
        file: imageFile,
        folder: "cards",
        fileName: id,
      });

      imageUrl = upload.imageUrl;
      imagePath = upload.imagePath;
    }

    await createCard({
      id,
      name,
      description,
      type: type as
        | "duck"
        | "duck_xp"
        | "island_item"
        | "accessory"
        | "border"
        | "pin"
        | "digital_art"
        | "ravelbox",
      rarity: rarity as "common" | "rare" | "epic" | "legendary",
      duckId: duckId || undefined,
      xpAmount: Number(xpAmount) > 0 ? Number(xpAmount) : undefined,
      imageUrl,
      imagePath,
    });

    setMessage("Carta criada com sucesso.");
    router.push("/admin/cartas");
  } catch (error) {
    console.error(error);
    setMessage("Erro ao criar carta.");
  } finally {
    setIsSaving(false);
  }
}
```

Atualize o botão:

```tsx
<button
  type="submit"
  disabled={isSaving}
  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving ? "Criando..." : "Criar carta"}
</button>
```

---

## 14. Atualizar `app/admin/patos/novo/page.tsx`

Abra:

```txt
app/admin/patos/novo/page.tsx
```

Adicione imports:

```ts
import { AdminImageUpload } from "@/components/admin/AdminImageUpload";
import { uploadImage } from "@/services/upload-service";
```

Adicione estados:

```ts
const [imageFile, setImageFile] = useState<File | null>(null);
const [gifFile, setGifFile] = useState<File | null>(null);
const [isSaving, setIsSaving] = useState(false);
```

No formulário, adicione:

```tsx
<AdminImageUpload
  label="Imagem do pato"
  file={imageFile}
  onChange={setImageFile}
  helper="Imagem principal do pato para coleção e cards. Recomendado: PNG ou WEBP."
/>

<AdminImageUpload
  label="GIF do pato para ilha"
  file={gifFile}
  onChange={setGifFile}
  helper="Opcional. Use para animação do pato pulando na ilha."
  accept="image/gif"
/>
```

Atualize `handleSubmit`.

```ts
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    setIsSaving(true);
    setMessage("");

    const safeSlug = slug.trim().toLowerCase().replaceAll(" ", "-");
    const id = generateIdFromSlug(safeSlug);

    let imageUrl: string | undefined;
    let imagePath: string | undefined;
    let gifUrl: string | undefined;
    let gifPath: string | undefined;

    if (imageFile) {
      const upload = await uploadImage({
        file: imageFile,
        folder: "ducks",
        fileName: id,
      });

      imageUrl = upload.imageUrl;
      imagePath = upload.imagePath;
    }

    if (gifFile) {
      const upload = await uploadImage({
        file: gifFile,
        folder: "ducks/gifs",
        fileName: id,
      });

      gifUrl = upload.imageUrl;
      gifPath = upload.imagePath;
    }

    await createDuck({
      id,
      name,
      slug: safeSlug,
      theme,
      rarity: rarity as "common" | "rare" | "epic" | "legendary",
      maxLevel: Number(maxLevel),
      imageUrl,
      imagePath,
      gifUrl,
      gifPath,
    });

    setMessage("Pato criado com sucesso.");
    router.push("/admin/patos");
  } catch (error) {
    console.error(error);
    setMessage("Erro ao criar pato.");
  } finally {
    setIsSaving(false);
  }
}
```

Atualize o botão:

```tsx
<button
  type="submit"
  disabled={isSaving}
  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving ? "Criando..." : "Criar pato"}
</button>
```

---

## 15. Atualizar `app/admin/pacotes/novo/page.tsx`

Abra:

```txt
app/admin/pacotes/novo/page.tsx
```

Adicione imports:

```ts
import { AdminImageUpload } from "@/components/admin/AdminImageUpload";
import { uploadImage } from "@/services/upload-service";
```

Adicione estados:

```ts
const [imageFile, setImageFile] = useState<File | null>(null);
const [isSaving, setIsSaving] = useState(false);
```

No formulário, adicione:

```tsx
<AdminImageUpload
  label="Imagem do pacote"
  file={imageFile}
  onChange={setImageFile}
  helper="Imagem do pacote que aparecerá para o usuário na tela /pacotes."
/>
```

Atualize `handleSubmit`:

```ts
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    setIsSaving(true);
    setMessage("");

    if (selectedCards.length === 0) {
      setMessage("Selecione pelo menos uma carta para o pacote.");
      return;
    }

    let imageUrl: string | undefined;
    let imagePath: string | undefined;

    if (imageFile) {
      const upload = await uploadImage({
        file: imageFile,
        folder: "packs",
        fileName: id,
      });

      imageUrl = upload.imageUrl;
      imagePath = upload.imagePath;
    }

    await createPack({
      id,
      name,
      description,
      cardsQuantity: Number(cardsQuantity),
      cardPool: selectedCards,
      imageUrl,
      imagePath,
    });

    setMessage("Pacote criado com sucesso.");
    router.push("/admin/pacotes");
  } catch (error) {
    console.error(error);
    setMessage("Erro ao criar pacote.");
  } finally {
    setIsSaving(false);
  }
}
```

Atenção: como há `return` dentro do `try`, o `finally` ainda executa normalmente.

Atualize o botão:

```tsx
<button
  type="submit"
  disabled={isSaving}
  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving ? "Criando..." : "Criar pacote"}
</button>
```

---

## 16. Atualizar `RealReceivedCard` para mostrar imagem da carta

Abra:

```txt
components/packs/RealReceivedCard.tsx
```

Atualmente deve ter algo como:

```tsx
<div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black text-6xl">
  {typeIcon[card.type]}
</div>
```

Substitua por:

```tsx
<div className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-black">
  {card.imageUrl ? (
    <img
      src={card.imageUrl}
      alt={card.name}
      className="h-full w-full object-contain"
    />
  ) : (
    <span className="text-6xl">{typeIcon[card.type]}</span>
  )}
</div>
```

Se quiser carta maior no modal, pode usar `h-72`.

---

## 17. Atualizar `RealPackCard` para mostrar imagem do pacote

Abra:

```txt
components/packs/RealPackCard.tsx
```

Procure o trecho do emoji:

```tsx
<div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-yellow-400/40 bg-zinc-950/70 text-6xl shadow-xl">
  🎴
</div>
```

Substitua por:

```tsx
<div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-yellow-400/40 bg-zinc-950/70 text-6xl shadow-xl">
  {grantedPack.pack.imageUrl ? (
    <img
      src={grantedPack.pack.imageUrl}
      alt={grantedPack.pack.name}
      className="h-full w-full object-cover"
    />
  ) : (
    "🎴"
  )}
</div>
```

---

## 18. Atualizar `/admin/cartas` para mostrar miniatura

Abra:

```txt
app/admin/cartas/page.tsx
```

Atualize os headers da tabela:

```tsx
<AdminDataTable headers={["Imagem", "Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
```

Ajuste os `colSpan` de loading/vazio de `5` para `6`.

No map, adicione a primeira coluna:

```tsx
<td className="px-5 py-4">
  <div className="flex h-16 w-12 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
    {card.imageUrl ? (
      <img
        src={card.imageUrl}
        alt={card.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-xl">🎴</span>
    )}
  </div>
</td>
```

---

## 19. Atualizar `/admin/patos` para mostrar miniatura

Abra:

```txt
app/admin/patos/page.tsx
```

Atualize headers:

```tsx
<AdminDataTable headers={["Imagem", "Nome", "Tema", "Raridade", "Nível máximo", "Status"]}>
```

Ajuste `colSpan` para `6`.

No map, adicione a primeira coluna:

```tsx
<td className="px-5 py-4">
  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
    {duck.imageUrl ? (
      <img
        src={duck.imageUrl}
        alt={duck.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-xl">🦆</span>
    )}
  </div>
</td>
```

---

## 20. Atualizar `/admin/pacotes` para mostrar miniatura

Abra:

```txt
app/admin/pacotes/page.tsx
```

Atualize headers:

```tsx
<AdminDataTable headers={["Imagem", "Nome", "Cartas por pacote", "Cartas no pool", "Status"]}>
```

Ajuste `colSpan` para `5`.

No map, adicione a primeira coluna:

```tsx
<td className="px-5 py-4">
  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
    {pack.imageUrl ? (
      <img
        src={pack.imageUrl}
        alt={pack.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-xl">🎴</span>
    )}
  </div>
</td>
```

---

## 21. Atualizar coleção para mostrar imagem do pato

Abra:

```txt
app/colecao/page.tsx
```

Procure o trecho onde aparece:

```tsx
🦆
```

Substitua por:

```tsx
{item.duck.imageUrl ? (
  <img
    src={item.duck.imageUrl}
    alt={item.duck.name}
    className="h-full w-full object-cover"
  />
) : (
  "🦆"
)}
```

Exemplo completo:

```tsx
<div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-yellow-400/30 bg-yellow-400/10 text-6xl shadow-xl">
  {item.duck.imageUrl ? (
    <img
      src={item.duck.imageUrl}
      alt={item.duck.name}
      className="h-full w-full object-cover"
    />
  ) : (
    "🦆"
  )}
</div>
```

---

## 22. Atualizar `next.config.ts` para imagens remotas

Se você usar `next/image` para imagens do Firebase Storage, precisará configurar domínio remoto.

Abra:

```txt
next.config.ts
```

Adicione:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
```

Se você usar apenas `<img>`, não precisa dessa configuração.

---

## 23. Fluxo de teste

### 1. Ativar Firebase Storage

No Firebase Console, confirme se Storage está ativo.

### 2. Atualizar regras do Storage

Use as regras temporárias:

```txt
allow read: if true;
allow write: if request.auth != null;
```

### 3. Rodar o projeto

```bash
npm run dev
```

### 4. Login como admin

Acesse:

```txt
/login
```

Entre com uma conta admin.

### 5. Criar pato com imagem

Acesse:

```txt
/admin/patos/novo
```

Crie um pato e envie imagem.

Depois veja:

```txt
/admin/patos
```

A miniatura deve aparecer.

### 6. Criar carta com imagem

Acesse:

```txt
/admin/cartas/nova
```

Crie uma carta e envie uma arte.

Depois veja:

```txt
/admin/cartas
```

A miniatura deve aparecer.

### 7. Criar pacote com imagem

Acesse:

```txt
/admin/pacotes/novo
```

Crie um pacote e envie imagem.

Depois veja:

```txt
/admin/pacotes
```

A miniatura deve aparecer.

### 8. Liberar e abrir pacote

Acesse:

```txt
/admin/liberar-pacote
```

Libere o pacote.

Depois acesse:

```txt
/pacotes
```

Abra o pacote.

A carta revelada deve aparecer com a imagem real.

---

## 24. Onde as imagens devem aparecer

Depois desta etapa, imagens devem aparecer em:

```txt
/admin/patos
/admin/cartas
/admin/pacotes
/pacotes
modal de abertura de pacote
/colecao
```

Futuramente também devem aparecer em:

```txt
/ilha/[username]
/patos/[duckId]
/overlay/live
```

---

## 25. Problemas comuns

### Erro: Storage não configurado

Verifique se você ativou o Storage no Firebase Console.

### Erro: permission denied no upload

Verifique as regras do Storage.

### Imagem sobe, mas não aparece

Verifique se `imageUrl` foi salvo no Firestore.

### Preview aparece, mas upload falha

Verifique:

```txt
se usuário está logado
se Storage está ativo
se as regras permitem write
```

### Next Image bloqueando Firebase

Use `<img>` ou configure `next.config.ts`.

---

## 26. Segurança e produção

As regras temporárias permitem qualquer usuário logado fazer upload.

Para produção, o ideal é restringir upload para admin:

```txt
allow write: if request.auth != null
  && firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "admin";
```

A regra exata pode variar, mas o objetivo é:

```txt
somente admin pode enviar imagens para cards, ducks e packs
```

---

## 27. O que essa etapa entrega

Ao final da Etapa 14.1, você terá:

```txt
Firebase Storage configurado
upload de imagem no admin
upload de imagem de carta
upload de imagem de pato
upload de gif de pato para ilha
upload de imagem de pacote
imageUrl salvo no Firestore
imagePath salvo no Firestore
miniaturas no admin
imagem real nas cartas reveladas
imagem real nos pacotes
imagem real na coleção
```

---

## 28. Próxima etapa recomendada

Depois dessa etapa, podemos seguir para:

```txt
Etapa 15 — Probabilidade e raridade no sorteio de cartas
```

Nela vamos fazer:

```txt
cartas comuns saírem mais
cartas raras saírem menos
cartas épicas/lendárias terem menor chance
pacotes terem regras de drop
possível garantia de uma carta rara por pacote
controle admin das chances
```
