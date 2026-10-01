# 🚀 BroadcastApp: Firebase SaaS Broadcast

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI_9-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

**App publicado:** [https://fir-saas-auth-4a138.web.app](https://fir-saas-auth-4a138.web.app) · **Docs:** [gitpagedocs](https://vidigal-code.github.io/firebase-saas-auth/)

## 🇧🇷 Português

<details open>
<summary><strong>Ver detalhes</strong></summary>

### O que é

Aplicação **SaaS multi-tenant de Broadcast**: cada usuário cadastrado é um cliente que gerencia suas **conexões**, os **contatos** de cada conexão e **mensagens** enviadas na hora ou agendadas. O envio é simulado: no horário agendado, uma **Cloud Function** muda a mensagem de "Agendada" para "Enviada", mesmo com o app fechado.

### Requisitos do desafio → implementação

| Requisito | Onde |
|---|---|
| Login e cadastro (Firebase Auth) | `web/src/features/auth`, `web/src/pages/auth` |
| CRUD de conexões | `web/src/entities/connection`, `web/src/features/connection-editor` |
| CRUD de contatos (nome, telefone) por conexão | `web/src/entities/contact`, `web/src/features/contact-editor` |
| Broadcast: selecionar contatos, enviar agora, agendar, listar, filtrar, editar, excluir | `web/src/pages/broadcast`, `web/src/features/message-composer`, `web/src/features/message-filter` |
| Agendada → Enviada no backend | `functions/src/messages/dispatchDueMessages.ts` (agenda a cada 1 min). **Implementado e testado, mas inativo no app publicado**; veja abaixo |
| Multi-tenant e isolamento | `firestore.rules` + `tests/firestore.rules.test.ts` |
| MUI para componentes, Tailwind para estilo | `web/src/shared/theme`, `web/src/app/styles/global.css` |
| 100% responsivo (extra) | menu hambúrguer abaixo de 900px (`web/src/widgets/app-shell/NavigationDrawer.tsx`); conteúdo centralizado e empilhado abaixo de 600px |
| Paradigma funcional (sem classes) | todo o código |
| Tempo real | `web/src/shared/firebase/useRealtimeQuery.ts` (`onSnapshot`) |
| Vite | `web/vite.config.ts` |
| Sem subcoleções | coleções planas `connections`, `contacts`, `messages`, `users` |
| `/functions` e `/web` | estrutura do repositório |
| Firebase Hosting | `firebase.json` + deploy automático |

### ⚠️ Disparo automático: implementado, mas inativo (feature flag)

A mudança automática de **"Agendada" para "Enviada"** é feita pela Cloud Function `dispatchScheduledMessages` (`functions/src/messages/dispatchDueMessages.ts`). Ela roda a cada minuto, está **implementada e coberta por testes** (`functions/test/dispatchDueMessages.test.ts`, no emulador do Firestore), mas **está desativada no ambiente publicado**.

O motivo é que publicar Cloud Functions exige o plano **Blaze** (pago por uso) do Firebase, e o projeto `fir-saas-auth-4a138` está no plano gratuito (Spark).

A funcionalidade fica atrás da flag `VITE_SCHEDULED_DISPATCH_ENABLED`, hoje **`false`**:

| Com a flag `false` (atual) | Com a flag `true` |
|---|---|
| O deploy publica só regras, índices e Hosting | O deploy também publica as Cloud Functions |
| O app avisa que o disparo automático está inativo (na tela de Broadcast e ao agendar) | O aviso some e as mensagens agendadas viram "Enviada" no horário, mesmo com o app fechado |
| Mensagens agendadas continuam "Agendada"; dá para enviá-las em **Editar → Enviar agora** | Fluxo completo do desafio |

As funções de limpeza em cascata (`cleanupDeletedConnection` e `detachDeletedContact`) também são Cloud Functions e seguem a mesma regra. Sem elas, excluir uma conexão não apaga automaticamente os contatos e as mensagens dela. Esses dados continuam isolados pelas regras e só o próprio cliente os vê.

#### O que é o plano Blaze e quanto custa

O **Blaze** é o plano "pague pelo que usar" do Firebase. Ele **mantém as mesmas cotas gratuitas do plano Spark** e só cobra o que passar delas, mas exige uma conta de faturamento (cartão de crédito). Contas novas costumam receber crédito promocional ao fazer o upgrade.

Para este app, o custo esperado é **zero**, porque o uso fica bem abaixo das cotas gratuitas mensais (valores de [firebase.google.com/pricing](https://firebase.google.com/pricing); confira antes de ativar, eles podem mudar):

| Recurso | Uso estimado | Gratuito por mês |
|---|---|---|
| Invocações de Cloud Functions | ~44 mil (agendador a cada 1 minuto) | 2 milhões |
| Tempo de execução das Functions | poucos milhares de GB-s | 400 mil GB-s |
| Imagens das Functions (Artifact Registry) | algumas centenas de MB | 500 MB |
| Cloud Scheduler | 1 job | 3 jobs por conta de faturamento |
| Firestore | uso de teste | 50 mil leituras e 20 mil gravações por dia |
| Hosting | ~1,5 MB por visita | 360 MB/dia de tráfego |

Recomendação: crie um alerta de orçamento em https://console.cloud.google.com/billing/budgets (por exemplo, US$ 1) para ser avisado por e-mail se aparecer algum custo.

**Como ativar:**
1. Ative o plano Blaze em https://console.firebase.google.com/project/fir-saas-auth-4a138/usage/details.
2. Troque a flag para `"true"` em `web/.env` (deploy local) e na variável do repositório: `gh variable set VITE_SCHEDULED_DISPATCH_ENABLED --body true`.
3. Publique: `npm run deploy:functions && npm run deploy`, ou faça um push na `main` com o deploy automático configurado.

### Modelo de dados

| Coleção | Campos |
|---|---|
| `users/{uid}` | `email`, `createdAt` |
| `connections/{id}` | `clientId`, `name`, `createdAt`, `updatedAt` |
| `contacts/{id}` | `clientId`, `connectionId`, `name`, `phone`, `createdAt`, `updatedAt` |
| `messages/{id}` | `clientId`, `connectionId`, `contactIds[]`, `content`, `status` (`scheduled`/`sent`), `scheduledAt`, `sentAt`, `createdAt`, `updatedAt` |

### Isolamento entre clientes

- Todo documento guarda o `clientId` (o `uid` do dono); leituras e consultas só passam se `clientId == request.auth.uid`.
- Na criação, o `connectionId` precisa apontar para uma conexão **do próprio cliente** (`get()` nas regras).
- `clientId` e `connectionId` são imutáveis; esquema, tamanhos e telefone são validados nas regras.
- Datas vêm do servidor (`request.time`), e só a Cloud Function faz a transição automática para `sent`.
- Exclusões em cascata (contatos e mensagens de uma conexão; contato removido dos destinatários) rodam em Cloud Functions.

### Como rodar

```bash
npm run install:all
cp web/.env.example web/.env      # preencha com `firebase apps:sdkconfig WEB`
npm run emulators                 # Auth, Firestore e Functions locais
npm --prefix web run dev:emulators
```

| Script (raiz) | Descrição |
|---|---|
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript em todo o projeto |
| `npm test` | regras do Firestore, Functions, testes unitários e de integração do web (com emuladores) |
| `npm run build` | build das Functions e do web |
| `npm run deploy` | regras, índices e Hosting |
| `npm run deploy:functions` | Cloud Functions (requer o plano Blaze) |

Pré-requisitos: Node 22, Java 21+ (emulador do Firestore), Firebase CLI e projeto no plano Blaze (Functions agendadas).

### Deploy automático

`.github/workflows/firebase-deploy.yml`: a cada push na `main` roda lint, typecheck, testes e build e depois faz o deploy (as Cloud Functions só entram quando a variável `VITE_SCHEDULED_DISPATCH_ENABLED` é `true`). O deploy só roda quando o secret existe. Configure no GitHub as variables `VITE_FIREBASE_*` e o secret `FIREBASE_SERVICE_ACCOUNT` (JSON de uma conta de serviço com *Firebase Admin*, *Cloud Functions Admin*, *Service Account User* e *Cloud Scheduler Admin*).

### Qualidade

- TDD com Vitest: regras (emulador), Cloud Functions (emulador), domínio e componentes do web, e integração dos repositórios reais com os emuladores de Auth e Firestore.
- SonarQube (`sonar-project.properties`) e ESLint com `typescript-eslint` strict.

</details>

## 🇺🇸 English

<details>
<summary><strong>View details</strong></summary>

Multi-tenant **broadcast SaaS** built with React 19, TypeScript, Vite 8, MUI 9, Tailwind CSS 4 and Firebase (Auth, Firestore, Cloud Functions v2 on Node 22). Each registered user is a client that manages connections, the contacts of each connection, and messages that are sent right away or scheduled. A scheduled Cloud Function (`dispatchScheduledMessages`, every minute) flips due messages from `scheduled` to `sent` on the server.

- **Data model**: flat collections (`users`, `connections`, `contacts`, `messages`, no subcollections); every document stores the owner's `clientId`.
- **Isolation**: `firestore.rules` only allows reads, queries and writes on documents whose `clientId` is the caller's uid, checks that referenced connections belong to the caller, keeps `clientId`/`connectionId` immutable, and validates schema and message lifecycle. 25 rule tests run on the emulator.
- **Real time**: every list uses Firestore `onSnapshot` listeners.
- **Run locally**: `npm run install:all`, `cp web/.env.example web/.env`, `npm run emulators`, `npm --prefix web run dev:emulators`.
- **Test / build / deploy**: `npm test`, `npm run build`, `npm run deploy` (plus `npm run deploy:functions`); GitHub Actions deploys on every push to `main`.
- **Feature flag**: the scheduled dispatch Cloud Function is implemented and tested but inactive in the published app (`VITE_SCHEDULED_DISPATCH_ENABLED=false`), because deploying Cloud Functions requires the Firebase Blaze plan. The app shows a notice while it is off.

</details>

## 🇪🇸 Español

<details>
<summary><strong>Ver detalles</strong></summary>

**SaaS multi-tenant de broadcast** con React 19, TypeScript, Vite 8, MUI 9, Tailwind CSS 4 y Firebase (Auth, Firestore, Cloud Functions v2 en Node 22). Cada usuario registrado es un cliente que gestiona conexiones, los contactos de cada conexión y mensajes enviados al instante o programados. Una Cloud Function programada (`dispatchScheduledMessages`, cada minuto) cambia en el servidor los mensajes de `scheduled` a `sent`.

- **Modelo de datos**: colecciones planas (`users`, `connections`, `contacts`, `messages`, sin subcolecciones); cada documento guarda el `clientId` del dueño.
- **Aislamiento**: `firestore.rules` solo permite lecturas, consultas y escrituras en documentos cuyo `clientId` es el uid del usuario, verifica que las conexiones referenciadas sean suyas, mantiene `clientId`/`connectionId` inmutables y valida el esquema y el ciclo de vida de los mensajes.
- **Tiempo real**: todas las listas usan listeners `onSnapshot` de Firestore.
- **Ejecutar**: `npm run install:all`, `cp web/.env.example web/.env`, `npm run emulators`, `npm --prefix web run dev:emulators`.

</details>

---

Desenvolvido por [Vidigal-code](https://github.com/Vidigal-code)
