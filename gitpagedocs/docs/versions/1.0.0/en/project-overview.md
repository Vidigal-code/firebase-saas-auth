# Project Overview

## BroadcastApp — Firebase SaaS Auth

A complete SaaS platform for mass communication management built with **React**, **TypeScript**, **MUI**, and **Firebase**.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite |
| **UI** | Material UI (MUI) v6 |
| **State** | Redux Toolkit |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore (Realtime) |
| **Backend** | Firebase Cloud Functions |
| **Hosting** | Firebase Hosting |
| **Architecture** | Feature-Sliced Design (FSD) |
| **i18n** | Custom JSON-based (PT/EN/ES) |

## Project Structure (FSD)

```
web/src/
├── app/          → Providers, Router, Store
├── pages/        → LoginPage, RegisterPage, ConnectionsPage, ...
├── widgets/      → PublicLayout, DashboardLayout, AppHeader, AppSidebar
├── features/     → Auth, Connection, Contact, Message CRUD
├── entities/     → ConnectionCard, ContactCard, MessageCard
└── shared/       → Hooks, UI components, Config, Constants, Langs
```

## Key Principles

- **SOLID** — Single responsibility, open for extension
- **Clean Code** — No comments, small functions, no hardcodes
- **FSD** — Strict layer isolation (shared → entities → features → widgets → pages → app)
- **Multi-tenant** — Data isolation per user via Firestore Rules
- **100% Responsive** — Mobile-first with unified drawer pattern
