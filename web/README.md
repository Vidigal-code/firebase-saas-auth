# 🖥️ BroadcastApp: Web

[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MUI 9](https://img.shields.io/badge/MUI_9-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Tailwind 4](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

Frontend do BroadcastApp em Feature-Sliced Design, paradigma funcional e tempo real com Firestore.

## Estrutura

```
src/
├── app/        # AppProviders (tema, i18n, notificações, sessão), router, estilos globais
├── pages/      # home, auth, connections, contacts, broadcast, not-found
├── widgets/    # app-shell (TopBar, AccountMenu, layouts) e connection-shell (abas da conexão)
├── features/   # auth, connection-editor, contact-editor, message-composer, message-filter
├── entities/   # session, connection, contact, message (modelo, repositório, hooks, UI)
├── shared/     # firebase, i18n, theme, domain, hooks, lib, ui
└── test/       # utilitários de teste e testes de integração
```

## Decisões

- **MUI + Tailwind**: componentes do MUI e estilização com classes Tailwind, seguindo o guia oficial (CSS layers `theme, base, mui, components, utilities` e `StyledEngineProvider enableCssLayer`). As cores existem só no tema do MUI (`cssVariables`) e são mapeadas para o Tailwind em `app/styles/global.css`.
- **Tempo real**: `useRealtimeQuery`/`useRealtimeDocument` (sobre `useSubscription`) assinam `onSnapshot` e descartam dados de consultas antigas.
- **Repositórios**: cada entidade concentra consultas tipadas (conversores somente leitura) e escritas com payloads explícitos e `serverTimestamp()`.
- **Formulários**: React Hook Form + Zod; as mensagens de validação são chaves de tradução.
- **i18n tipado**: `t('broadcast.filters.sent')` só aceita chaves que existem em `locales/pt.json`.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Vite usando o projeto do `.env` |
| `npm run dev:emulators` | Vite conectado aos emuladores locais |
| `npm run build` | typecheck + build de produção |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm test` / `npm run test:coverage` | testes unitários e de componentes (jsdom) |
| `npm run test:integration` | repositórios e auth reais contra os emuladores de Auth e Firestore |

Variáveis de ambiente: veja `.env.example`.
