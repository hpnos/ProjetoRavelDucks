# Etapa 14.1 Ajustada — Cadastro manual de URL de imagem com Cloudinary

Esta etapa substitui a ideia anterior de upload via Firebase Storage.

Em vez de o sistema fazer upload da imagem, o fluxo será mais simples:

```txt
Ilustrador entrega a arte
        ↓
Admin sobe a imagem manualmente no Cloudinary
        ↓
Admin copia a URL da imagem
        ↓
Admin cola a URL no formulário do sistema
        ↓
Sistema salva imageUrl no Firestore
        ↓
Sistema exibe a imagem real
```

Assim, não precisamos usar Firebase Storage agora, não precisamos configurar upload no frontend e evitamos complexidade/cobrança adicional.

---

## 1. Objetivo da etapa

Permitir cadastrar manualmente URLs de imagens para:

```txt
cartas
patos
pacotes
```

Essas URLs serão salvas no Firestore em campos como:

```txt
imageUrl
gifUrl
```

Depois, as telas do sistema usarão essas URLs para exibir as imagens reais.

---

## 2. O que muda em relação à Etapa 14.1 anterior

A versão anterior previa:

```txt
Firebase Storage
upload de arquivo no admin
preview de imagem
imagePath
upload-service.ts
AdminImageUpload.tsx
```

Agora vamos trocar por:

```txt
Campo de texto imageUrl
Campo de texto gifUrl para pato, se necessário
Campo opcional imageUrl para pacote
Campo opcional imageUrl para carta
```

Ou seja, **não criaremos upload-service** e **não usaremos Firebase Storage** nesta etapa.

---

## 3. Fluxo recomendado com Cloudinary

No Cloudinary:

```txt
Media Library
  ↓
Upload
  ↓
Selecionar imagem
  ↓
Copiar Secure URL / Delivery URL
```

Exemplo de URL:

```txt
https://res.cloudinary.com/seu-cloud-name/image/upload/v1234567890/cards/apolo.png
```

No sistema, o admin cola essa URL no campo:

```txt
URL da imagem
```

---

## 4. Estrutura que será atualizada

Vamos atualizar:

```txt
types/database.ts

services/
  cards-service.ts
  ducks-service.ts
  packs-service.ts

app/
  admin/
    cartas/
      nova/
        page.tsx
    patos/
      novo/
        page.tsx
    pacotes/
      novo/
        page.tsx
    cartas/
      page.tsx
    patos/
      page.tsx
    pacotes/
      page.tsx

components/
  packs/
    RealReceivedCard.tsx
    RealPackCard.tsx

app/
  colecao/
    page.tsx
```

Não criar:

```txt
lib/firebase/storage.ts
services/upload-service.ts
components/admin/AdminImageUpload.tsx
```

---

## 5. Atualizar tipos em `types/database.ts`

Abra:

```txt
types/database.ts
```

Atualize os tipos principais.

### `DuckDocument`

Adicione:

```ts
imageUrl?: string;
gifUrl?: string;
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
  gifUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `CardDocument`

Adicione:

```ts
imageUrl?: string;
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
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `PackDocument`

Adicione:

```ts
imageUrl?: string;
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
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. Atualizar `cards-service.ts`

Abra:

```txt
services/cards-service.ts
```

Atualize a interface de criação.

Antes:

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

Depois:

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
}
```

A função `createCard` pode continuar usando:

```ts
await setDoc(cardRef, {
  ...input,
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

Como ela usa `...input`, o `imageUrl` será salvo automaticamente.

---

## 7. Atualizar `ducks-service.ts`

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
  gifUrl?: string;
}
```

A função `createDuck` pode continuar usando:

```ts
await setDoc(duckRef, {
  ...input,
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

---

## 8. Atualizar `packs-service.ts`

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
}
```

A função `createPack` pode continuar usando:

```ts
await setDoc(packRef, {
  ...input,
  active: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

---

## 9. Atualizar formulário de carta

Abra:

```txt
app/admin/cartas/nova/page.tsx
```

Adicione estado:

```ts
const [imageUrl, setImageUrl] = useState("");
```

No formulário, adicione o campo:

```tsx
<AdminInput
  label="URL da imagem da carta"
  value={imageUrl}
  onChange={setImageUrl}
  placeholder="Ex: https://res.cloudinary.com/.../apolo.png"
/>
```

Sugestão: coloque esse campo depois da descrição ou depois da raridade.

No `handleSubmit`, atualize o `createCard` para enviar `imageUrl`:

```ts
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
  imageUrl: imageUrl.trim() || undefined,
});
```

---

## 10. Atualizar formulário de pato

Abra:

```txt
app/admin/patos/novo/page.tsx
```

Adicione estados:

```ts
const [imageUrl, setImageUrl] = useState("");
const [gifUrl, setGifUrl] = useState("");
```

No formulário, adicione:

```tsx
<AdminInput
  label="URL da imagem do pato"
  value={imageUrl}
  onChange={setImageUrl}
  placeholder="Ex: https://res.cloudinary.com/.../duck-apolo.png"
/>

<AdminInput
  label="URL do GIF do pato para ilha"
  value={gifUrl}
  onChange={setGifUrl}
  placeholder="Opcional. Ex: https://res.cloudinary.com/.../duck-apolo.gif"
/>
```

No `handleSubmit`, atualize o `createDuck`:

```ts
await createDuck({
  id,
  name,
  slug: safeSlug,
  theme,
  rarity: rarity as "common" | "rare" | "epic" | "legendary",
  maxLevel: Number(maxLevel),
  imageUrl: imageUrl.trim() || undefined,
  gifUrl: gifUrl.trim() || undefined,
});
```

---

## 11. Atualizar formulário de pacote

Abra:

```txt
app/admin/pacotes/novo/page.tsx
```

Adicione estado:

```ts
const [imageUrl, setImageUrl] = useState("");
```

No formulário, adicione:

```tsx
<AdminInput
  label="URL da imagem do pacote"
  value={imageUrl}
  onChange={setImageUrl}
  placeholder="Ex: https://res.cloudinary.com/.../pack-lendario.png"
/>
```

No `handleSubmit`, atualize o `createPack`:

```ts
await createPack({
  id,
  name,
  description,
  cardsQuantity: Number(cardsQuantity),
  cardPool: selectedCards,
  imageUrl: imageUrl.trim() || undefined,
});
```

---

## 12. Atualizar `/admin/cartas` para mostrar miniatura

Abra:

```txt
app/admin/cartas/page.tsx
```

Atualize os headers da tabela:

```tsx
<AdminDataTable headers={["Imagem", "Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
```

Ajuste os `colSpan` de loading/vazio para `6`.

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

## 13. Atualizar `/admin/patos` para mostrar miniatura

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

## 14. Atualizar `/admin/pacotes` para mostrar miniatura

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

## 15. Atualizar `RealReceivedCard` para mostrar imagem da carta

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

Se quiser deixar a carta maior no modal:

```tsx
h-72
```

---

## 16. Atualizar `RealPackCard` para mostrar imagem do pacote

Abra:

```txt
components/packs/RealPackCard.tsx
```

Procure:

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

## 17. Atualizar coleção para mostrar imagem do pato

Abra:

```txt
app/colecao/page.tsx
```

Procure o trecho onde aparece:

```tsx
🦆
```

Substitua por algo assim:

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

## 18. Atualizar telas antigas que usam emoji

Opcionalmente, procure no projeto por:

```txt
🦆
🎴
```

E substitua por imagem quando existir `imageUrl`.

Locais prováveis:

```txt
components/packs/RealReceivedCard.tsx
components/packs/RealPackCard.tsx
app/colecao/page.tsx
app/admin/cartas/page.tsx
app/admin/patos/page.tsx
app/admin/pacotes/page.tsx
```

---

## 19. Configuração de imagens remotas

Como vamos usar `<img>`, não precisa alterar `next.config.ts`.

Mas se o agente usar `next/image`, será necessário configurar:

```txt
next.config.ts
```

Com:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
```

Recomendação para esta etapa:

```txt
Usar <img> para simplificar.
```

---

## 20. Fluxo de teste

### 1. Subir imagem no Cloudinary

No Cloudinary:

```txt
Media Library
  ↓
Upload
  ↓
Selecionar imagem
```

Depois copie:

```txt
Secure URL
```

ou:

```txt
Delivery URL
```

### 2. Criar carta com URL

Acesse:

```txt
/admin/cartas/nova
```

Preencha:

```txt
ID: card-apolo
Nome: Apolo
Descrição: Seja luz nesse palco...
Tipo: Pato
Raridade: Lendário
URL da imagem: https://res.cloudinary.com/.../apolo.png
```

Salve.

### 3. Conferir admin

Acesse:

```txt
/admin/cartas
```

A miniatura da carta deve aparecer.

### 4. Criar pato com URL

Acesse:

```txt
/admin/patos/novo
```

Preencha:

```txt
Nome: Pato Apolo
Slug: pato-apolo
Tema: Apolo
Raridade: Lendário
URL da imagem: https://res.cloudinary.com/.../duck-apolo.png
URL do GIF: opcional
```

Salve.

### 5. Criar pacote com URL

Acesse:

```txt
/admin/pacotes/novo
```

Preencha:

```txt
ID: pack-apolo
Nome: Pacote Apolo
URL da imagem: https://res.cloudinary.com/.../pack-apolo.png
```

Selecione cartas e salve.

### 6. Liberar pacote

Acesse:

```txt
/admin/liberar-pacote
```

Libere o pacote para seu usuário.

### 7. Abrir pacote

Acesse:

```txt
/pacotes
```

Abra o pacote.

Resultado esperado:

```txt
A carta revelada aparece com a imagem real do Cloudinary.
```

---

## 21. O que esta etapa entrega

Ao final desta etapa, teremos:

```txt
campo imageUrl no cadastro de carta
campo imageUrl e gifUrl no cadastro de pato
campo imageUrl no cadastro de pacote
URLs salvas no Firestore
miniaturas no admin
imagem real na abertura de pacote
imagem real na coleção
sem Firebase Storage
sem upload no frontend
sem cobrança de Storage do Firebase
```

---

## 22. Limitações

Ainda teremos:

```txt
o admin precisa subir a imagem manualmente no Cloudinary
o admin precisa copiar e colar URL
não há validação avançada da URL
não há preview automático no formulário
não há upload direto no sistema
```

Essas limitações são aceitáveis para esta fase.

---

## 23. Próxima etapa recomendada

Depois disso, podemos seguir para:

```txt
Etapa 15 — Probabilidade e raridade no sorteio de cartas
```

Ou, se quiser melhorar a experiência do admin antes:

```txt
Etapa 14.2 — Preview de imagem por URL no formulário
```

Essa melhoria mostraria a imagem automaticamente quando o admin colasse a URL.
