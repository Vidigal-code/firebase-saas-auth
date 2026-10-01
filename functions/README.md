# ⚡ BroadcastApp: Cloud Functions

[![Cloud Functions v2](https://img.shields.io/badge/Cloud_Functions_v2-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/docs/functions)
[![Node 22](https://img.shields.io/badge/Node_22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

Backend do BroadcastApp: agendamento de mensagens e limpeza em cascata. Código funcional, sem classes, com Firebase Admin SDK 14 e firebase-functions 7.

## Funções

| Função | Gatilho | O que faz |
|---|---|---|
| `dispatchScheduledMessages` | agenda `every 1 minutes` | Busca `messages` com `status == 'scheduled'` e `scheduledAt <= agora` (paginado) e grava `status: 'sent'` e `sentAt`. Usa pré-condição `lastUpdateTime`, então uma edição concorrente do cliente nunca é sobrescrita. |
| `cleanupDeletedConnection` | `connections/{connectionId}` excluído | Remove os `contacts` e `messages` da conexão, sempre filtrando pelo `clientId` do dono. |
| `detachDeletedContact` | `contacts/{contactId}` excluído | Remove o contato de `contactIds` nas mensagens do mesmo cliente. |

## Estrutura

```
src/
├── index.ts                         # registro das funções e opções globais (região, instâncias)
├── config/runtime.ts                # região, agenda e tamanho de página
├── domain/                          # coleções, campos, status e escopo do tenant
├── lib/pagination.ts                # percorre consultas por páginas (startAfter)
├── lib/bulkWrite.ts                 # escreve em lote com BulkWriter
├── messages/dispatchDueMessages.ts
└── cascade/
    ├── deleteConnectionData.ts
    └── detachContactFromMessages.ts
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run build` | compila para `lib/` |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm test` | testes no emulador do Firestore (`../scripts/with-emulators.mjs`) |
| `npm run test:coverage` | idem, com cobertura (lcov) |
| `npm run deploy` | `firebase deploy --only functions` |
