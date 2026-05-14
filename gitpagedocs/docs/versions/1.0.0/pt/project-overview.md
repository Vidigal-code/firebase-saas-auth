# Visão Geral do Projeto

## BroadcastApp — Firebase SaaS Auth

Uma plataforma SaaS completa para gestão de comunicação em massa construída com **React**, **TypeScript**, **MUI** e **Firebase**.

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite |
| **UI** | Material UI (MUI) v6 |
| **Estado** | Redux Toolkit |
| **Autenticação** | Firebase Authentication |
| **Banco de Dados** | Cloud Firestore (Realtime) |
| **Backend** | Firebase Cloud Functions |
| **Hospedagem** | Firebase Hosting |
| **Arquitetura** | Feature-Sliced Design (FSD) |
| **i18n** | JSON customizado (PT/EN/ES) |

## Estrutura do Projeto (FSD)

```
web/src/
├── app/          → Providers, Router, Store
├── pages/        → LoginPage, RegisterPage, ConnectionsPage, ...
├── widgets/      → PublicLayout, DashboardLayout, AppHeader, AppSidebar
├── features/     → Auth, Connection, Contact, Message CRUD
├── entities/     → ConnectionCard, ContactCard, MessageCard
└── shared/       → Hooks, Componentes UI, Config, Constantes, Langs
```

## Princípios Chave

- **SOLID** — Responsabilidade única, aberto para extensão
- **Clean Code** — Sem comentários, funções pequenas, sem hardcodes
- **FSD** — Isolamento estrito de camadas (shared → entities → features → widgets → pages → app)
- **Multi-tenant** — Isolamento de dados por usuário via Firestore Rules
- **100% Responsivo** — Mobile-first com padrão unificado de drawer
