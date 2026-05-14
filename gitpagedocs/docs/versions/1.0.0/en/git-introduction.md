# Architecture

## Feature-Sliced Design (FSD)

The application follows the **Feature-Sliced Design** methodology, ensuring strict layer isolation and maximum code reusability.

### Layer Hierarchy

```
app → pages → widgets → features → entities → shared
```

Each layer can only import from layers below it. This ensures unidirectional dependency flow.

### Layers Explained

| Layer | Responsibility | Examples |
|---|---|---|
| `app` | Global setup, providers, router, store | `ThemeProvider`, `LangProvider`, `router` |
| `pages` | Full page compositions | `ConnectionsPage`, `LoginPage`, `NotFoundPage` |
| `widgets` | Complex UI blocks, layouts | `PublicLayout`, `DashboardLayout`, `AppSidebar` |
| `features` | Business logic + UI for user actions | `useConnectionCrud`, `ConnectionDialog` |
| `entities` | Domain models + display components | `ConnectionCard`, `ContactCard` |
| `shared` | Reusable utilities, UI, hooks, config | `useLang`, `LangSelector`, `ConfirmDialog` |

### State Management

- **Redux Toolkit** for global auth state (`user` slice)
- **React Context** for theme mode (`ThemeModeContext`)
- **React Context** for language (`LangContext`)
- **Local state** (`useState`) for UI-specific logic (dialogs, menus)
