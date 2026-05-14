# 🌐 BroadcastApp — Web Frontend

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![MUI](https://img.shields.io/badge/MUI_9-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)

---

## 🇧🇷 Descrição em Português

<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral

Frontend SPA (Single Page Application) do BroadcastApp, construído com **React 19**, **TypeScript**, **Vite 8** e **Material UI 9**. Segue a arquitetura **Feature-Sliced Design (FSD)** com princípios SOLID e Clean Code.

### Estrutura de Pastas

```
web/src/
├── app/                          # Camada de aplicação
│   ├── providers/index.tsx       # ThemeProvider, Redux, React Query
│   ├── router/index.tsx          # Rotas públicas e privadas
│   └── store/index.ts            # Redux Store
│
├── pages/                        # Composição de páginas
│   ├── auth/
│   │   ├── LoginPage.tsx         # Login com Firebase Auth
│   │   └── RegisterPage.tsx      # Cadastro com validação Yup
│   ├── home/HomePage.tsx         # Landing page pública
│   ├── connections/              # CRUD de conexões (paginado)
│   ├── contacts/                 # CRUD de contatos (paginado)
│   └── messages/                 # CRUD de mensagens (paginado + filtro)
│
├── features/                     # Lógica de negócio
│   ├── auth/ui/                  # Dialog de troca de senha
│   └── connection/
│       ├── hooks/                # useConnectionCrud (mutations + estado)
│       └── ui/                   # ConnectionDialog
│
├── entities/                     # Entidades de domínio
│   ├── connection/
│   │   ├── api/index.ts          # CRUD Firestore (create, update, delete)
│   │   ├── model/hooks.ts        # useConnections (realtime listener)
│   │   └── ui/ConnectionCard.tsx # Card visual da conexão
│   ├── contact/                  # Mesma estrutura (api, model)
│   └── message/                  # Mesma estrutura (api, model)
│
├── shared/                       # Reutilizáveis globais
│   ├── config/
│   │   ├── env.ts                # Variáveis de ambiente tipadas
│   │   └── firebase.ts           # Inicialização Firebase SDK
│   ├── constants/theme.ts        # Paletas dark/light, layout, brand
│   ├── hooks/
│   │   ├── useConfirmDialog.ts   # Estado do dialog de confirmação
│   │   ├── useCurrentUser.ts     # Auth state do Firebase
│   │   ├── useFirestoreCollection.ts # Listener genérico Firestore
│   │   └── usePagination.ts      # Paginação genérica reutilizável
│   ├── lib/firestore.ts          # CRUD helpers (addDocument, updateDocument...)
│   └── ui/
│       ├── ActionButtonGroup.tsx  # Grid de botões proporcionais
│       ├── ConfirmDialog.tsx      # Dialog de exclusão reutilizável
│       ├── EmptyState.tsx         # Estado vazio padrão
│       ├── PageHeader.tsx         # Header de página responsivo
│       ├── PageLoader.tsx         # Spinner de carregamento
│       ├── PaginationBar.tsx      # Barra de paginação
│       └── StatusChip.tsx         # Chip de status (enviada/agendada)
│
└── widgets/                      # Layouts compostos
    └── layouts/
        ├── DashboardLayout.tsx   # Layout autenticado (sidebar + header)
        ├── PublicLayout.tsx      # Layout público (header + footer)
        └── ui/
            ├── AppHeader.tsx     # Header com avatar, tema, menu
            ├── AppSidebar.tsx    # Sidebar com navegação
            ├── Footer.tsx        # Rodapé com créditos
            └── MobileDrawer.tsx  # Drawer mobile
```

### Configuração de Ambiente (`envexample.txt`)

Copie `envexample.txt` para `.env` e preencha com as credenciais do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=""              # API Key do Firebase (Console > Configurações do projeto)
VITE_FIREBASE_AUTH_DOMAIN=""          # Auth domain (ex: meu-projeto.firebaseapp.com)
VITE_FIREBASE_PROJECT_ID=""           # ID do projeto Firebase
VITE_FIREBASE_STORAGE_BUCKET=""       # Bucket de storage (ex: meu-projeto.appspot.com)
VITE_FIREBASE_MESSAGING_SENDER_ID="" # Sender ID do Cloud Messaging
VITE_FIREBASE_APP_ID=""               # App ID do Firebase
VITE_FIREBASE_MEASUREMENT_ID=""       # ID do Google Analytics (opcional)
VITE_START_THEME="dark"               # Tema inicial: "dark" ou "light"
```

**Onde encontrar:** Firebase Console → ⚙️ Configurações do projeto → Seus apps → SDK Web → `firebaseConfig`

**Importante:** O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.

### Comandos

```bash
npm install     # Instalar dependências
npm run dev     # Servidor de desenvolvimento (http://localhost:5173)
npm run build   # Build de produção (gera web/dist/)
npm run lint    # Verificação ESLint
npm run preview # Preview do build de produção
```

### Tema Dark/Light

O sistema de temas usa MUI `createTheme` com duas paletas completas (`DARK_PALETTE` e `LIGHT_PALETTE`). Todos os componentes MUI possuem overrides para garantir contraste correto em ambos os modos. A preferência é persistida em `localStorage` com a chave `broadcastapp:theme`.

### Responsividade

Todos os componentes são 100% responsivos usando breakpoints MUI (`xs`, `sm`, `md`, `lg`, `xl`):

- **Mobile (xs)**: Grid 1 coluna, botões empilhados, header empilhado, sidebar em drawer
- **Tablet (sm)**: Grid 2 colunas, botões lado a lado
- **Desktop (lg+)**: Grid 3 colunas, sidebar fixa visível

</details>

---

## 🇺🇸 English Description

<details>
<summary><strong>View Details</strong></summary>

### Overview

BroadcastApp's SPA (Single Page Application) frontend, built with **React 19**, **TypeScript**, **Vite 8**, and **Material UI 9**. Follows **Feature-Sliced Design (FSD)** architecture with SOLID and Clean Code principles.

### Folder Structure

```
web/src/
├── app/           # Application layer (Providers, Router, Store)
├── pages/         # Page composition (auth, connections, contacts, messages)
├── features/      # Business logic (CRUD hooks, feature-specific dialogs)
├── entities/      # Domain entities (api, model hooks, UI components)
├── shared/        # Global reusables (config, hooks, lib, ui components)
└── widgets/       # Composite layouts (Dashboard, Public, Header, Sidebar)
```

### Environment Configuration (`envexample.txt`)

Copy `envexample.txt` to `.env` and fill with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=""              # Firebase API Key (Console > Project settings)
VITE_FIREBASE_AUTH_DOMAIN=""          # Auth domain (e.g., my-project.firebaseapp.com)
VITE_FIREBASE_PROJECT_ID=""           # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET=""       # Storage bucket (e.g., my-project.appspot.com)
VITE_FIREBASE_MESSAGING_SENDER_ID="" # Cloud Messaging sender ID
VITE_FIREBASE_APP_ID=""               # Firebase App ID
VITE_FIREBASE_MEASUREMENT_ID=""       # Google Analytics ID (optional)
VITE_START_THEME="dark"               # Initial theme: "dark" or "light"
```

**Where to find:** Firebase Console → ⚙️ Project settings → Your apps → Web SDK → `firebaseConfig`

**Important:** The `.env` file is in `.gitignore` and must never be committed.

### Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server (http://localhost:5173)
npm run build   # Production build (outputs to web/dist/)
npm run lint    # ESLint check
npm run preview # Preview production build
```

### Dark/Light Theme

The theme system uses MUI `createTheme` with two complete palettes (`DARK_PALETTE` and `LIGHT_PALETTE`). All MUI components have style overrides ensuring proper contrast in both modes. Preference is persisted in `localStorage` under the key `broadcastapp:theme`.

### Responsiveness

All components are 100% responsive using MUI breakpoints (`xs`, `sm`, `md`, `lg`, `xl`):

- **Mobile (xs)**: 1-column grid, stacked buttons, stacked header, drawer sidebar
- **Tablet (sm)**: 2-column grid, inline buttons
- **Desktop (lg+)**: 3-column grid, fixed visible sidebar

</details>
