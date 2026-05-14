# 🚀 BroadcastApp — Firebase SaaS Platform

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI_9-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

---

## 🇧🇷 Descrição em Português

<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral

**BroadcastApp** é uma plataforma SaaS completa para gestão de comunicação em massa. Permite que cada usuário autenticado gerencie conexões isoladas, cadastre contatos e dispare mensagens com suporte a agendamento automático.

### Arquitetura

```
firebase-saas-auth/
├── web/                  # Frontend React (Vite + TypeScript + MUI)
├── functions/            # Cloud Functions (Processamento agendado)
├── firestore.rules       # Regras de segurança multi-tenant
├── firebase.json         # Configuração de deploy
└── .firebaserc           # Projeto Firebase vinculado
```

### Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🔐 **Autenticação** | Firebase Auth com registro, login e troca de senha |
| 🔗 **Conexões** | Espaços isolados por usuário (multi-tenant) |
| 👥 **Contatos** | Cadastro de nome e telefone por conexão |
| 💬 **Mensagens** | Disparo em massa com seleção múltipla de contatos |
| ⏰ **Agendamento** | Mensagens agendadas com processamento automático via Cloud Functions |
| 🌗 **Tema Dark/Light** | Alternância dinâmica com persistência em localStorage |
| 🌐 **Multi-idioma (i18n)** | Suporte a Português, English e Español com seletor dinâmico |
| 📱 **100% Responsivo** | Layout adaptável para desktop, tablet e mobile |
| 📄 **Paginação** | Listagens paginadas em todas as entidades |

### Internacionalização (i18n)

A plataforma suporta 3 idiomas com troca dinâmica:

| Idioma | Código | Arquivo |
|---|---|---|
| Português | `pt` | `web/src/shared/langs/pt.json` |
| English | `en` | `web/src/shared/langs/en.json` |
| Español | `es` | `web/src/shared/langs/es.json` |

**Formas de alterar o idioma:**
1. **Seletor no header** — disponível em todas as páginas
2. **URL parameter** — `?lang=pt` ou `?lang=en` ou `?lang=es`
3. **URL com tema** — `?lang=pt&theme=dark`
4. **Variável de ambiente** — `VITE_START_LANG="pt"` no `.env`
5. **Cache automático** — salvo em `localStorage` com chave `broadcastapp:lang`

**Prioridade de resolução:** URL > localStorage > .env > fallback (`pt`)

### Segurança (Firestore Rules)

Cada coleção (`connections`, `contacts`, `messages`) possui isolamento por `clientId`:

- **Leitura/Edição/Exclusão** → Apenas se `resource.data.clientId == request.auth.uid`
- **Criação** → Apenas se `request.resource.data.clientId == request.auth.uid`

Nenhum usuário pode acessar dados de outro usuário.

### Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, MUI 9 |
| Estado | Redux Toolkit, React Query |
| Auth | Firebase Authentication |
| Banco | Cloud Firestore (Realtime) |
| Functions | Cloud Functions v2 (Node 18) |
| Hosting | Firebase Hosting |
| Arquitetura | Feature-Sliced Design (FSD) |

### Como Rodar

```bash
# 1. Clonar o repositório
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth

# 2. Configurar o frontend
cd web
cp envexample.txt .env    # Preencher com credenciais do Firebase
npm install
npm run dev               # http://localhost:5173

# 3. Build e deploy
npm run build
cd ..
npx firebase-tools deploy --only firestore,hosting
```

### Estrutura FSD (Feature-Sliced Design)

```
web/src/
├── app/           # Providers, Router, Store, Tema
├── pages/         # Composição de páginas (Connections, Contacts, Messages)
├── features/      # Lógica de negócio (CRUD hooks, dialogs)
├── entities/      # Entidades de domínio (Connection, Contact, Message)
├── shared/        # Componentes, hooks, langs e utilitários reutilizáveis
└── widgets/       # Layouts (Dashboard, Public, Header, Sidebar, Footer)
```

</details>

---

## 🇺🇸 English Description

<details>
<summary><strong>View Details</strong></summary>

### Overview

**BroadcastApp** is a full-featured SaaS platform for mass communication management. Each authenticated user can manage isolated connections, register contacts, and send messages with automatic scheduling support.

### Architecture

```
firebase-saas-auth/
├── web/                  # React Frontend (Vite + TypeScript + MUI)
├── functions/            # Cloud Functions (Scheduled processing)
├── firestore.rules       # Multi-tenant security rules
├── firebase.json         # Deploy configuration
└── .firebaserc           # Linked Firebase project
```

### Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Firebase Auth with register, login and password change |
| 🔗 **Connections** | Isolated workspaces per user (multi-tenant) |
| 👥 **Contacts** | Name and phone registration per connection |
| 💬 **Messages** | Batch messaging with multiple contact selection |
| ⏰ **Scheduling** | Scheduled messages with automatic processing via Cloud Functions |
| 🌗 **Dark/Light Theme** | Dynamic toggle with localStorage persistence |
| 🌐 **Multi-language (i18n)** | Portuguese, English and Spanish support with dynamic selector |
| 📱 **100% Responsive** | Adaptive layout for desktop, tablet, and mobile |
| 📄 **Pagination** | Paginated listings across all entities |

### Internationalization (i18n)

The platform supports 3 languages with dynamic switching:

| Language | Code | File |
|---|---|---|
| Português | `pt` | `web/src/shared/langs/pt.json` |
| English | `en` | `web/src/shared/langs/en.json` |
| Español | `es` | `web/src/shared/langs/es.json` |

**Ways to change the language:**
1. **Header selector** — available on all pages
2. **URL parameter** — `?lang=pt` or `?lang=en` or `?lang=es`
3. **URL with theme** — `?lang=pt&theme=dark`
4. **Environment variable** — `VITE_START_LANG="pt"` in `.env`
5. **Automatic cache** — saved in `localStorage` under `broadcastapp:lang`

**Resolution priority:** URL > localStorage > .env > fallback (`pt`)

### Security (Firestore Rules)

Each collection (`connections`, `contacts`, `messages`) has isolation by `clientId`:

- **Read/Update/Delete** → Only if `resource.data.clientId == request.auth.uid`
- **Create** → Only if `request.resource.data.clientId == request.auth.uid`

No user can access another user's data.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, MUI 9 |
| State | Redux Toolkit, React Query |
| Auth | Firebase Authentication |
| Database | Cloud Firestore (Realtime) |
| Functions | Cloud Functions v2 (Node 18) |
| Hosting | Firebase Hosting |
| Architecture | Feature-Sliced Design (FSD) |

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth

# 2. Setup frontend
cd web
cp envexample.txt .env    # Fill with your Firebase credentials
npm install
npm run dev               # http://localhost:5173

# 3. Build and deploy
npm run build
cd ..
npx firebase-tools deploy --only firestore,hosting
```

### FSD Structure (Feature-Sliced Design)

```
web/src/
├── app/           # Providers, Router, Store, Theme
├── pages/         # Page composition (Connections, Contacts, Messages)
├── features/      # Business logic (CRUD hooks, dialogs)
├── entities/      # Domain entities (Connection, Contact, Message)
├── shared/        # Reusable components, hooks, langs, and utilities
└── widgets/       # Layouts (Dashboard, Public, Header, Sidebar, Footer)
```

</details>

---

## 📝 License

Created by [Vidigal-code](https://github.com/Vidigal-code)
