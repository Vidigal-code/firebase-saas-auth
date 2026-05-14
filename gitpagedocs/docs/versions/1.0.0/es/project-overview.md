# Visión General del Proyecto

## BroadcastApp — Firebase SaaS Auth

Una plataforma SaaS completa para gestión de comunicación masiva construida con **React**, **TypeScript**, **MUI** y **Firebase**.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite |
| **UI** | Material UI (MUI) v6 |
| **Estado** | Redux Toolkit |
| **Autenticación** | Firebase Authentication |
| **Base de Datos** | Cloud Firestore (Realtime) |
| **Backend** | Firebase Cloud Functions |
| **Hosting** | Firebase Hosting |
| **Arquitectura** | Feature-Sliced Design (FSD) |
| **i18n** | JSON personalizado (PT/EN/ES) |

## Estructura del Proyecto (FSD)

```
web/src/
├── app/          → Providers, Router, Store
├── pages/        → LoginPage, RegisterPage, ConnectionsPage, ...
├── widgets/      → PublicLayout, DashboardLayout, AppHeader, AppSidebar
├── features/     → Auth, Connection, Contact, Message CRUD
├── entities/     → ConnectionCard, ContactCard, MessageCard
└── shared/       → Hooks, Componentes UI, Config, Constantes, Langs
```

## Principios Clave

- **SOLID** — Responsabilidad única, abierto a extensión
- **Clean Code** — Sin comentarios, funciones pequeñas, sin hardcodes
- **FSD** — Aislamiento estricto de capas (shared → entities → features → widgets → pages → app)
- **Multi-tenant** — Aislamiento de datos por usuario vía Firestore Rules
- **100% Responsivo** — Mobile-first con patrón unificado de drawer
