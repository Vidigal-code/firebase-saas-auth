# Arquitectura

## Feature-Sliced Design (FSD)

La aplicación sigue la metodología **Feature-Sliced Design**, garantizando aislamiento estricto de capas y máxima reutilización de código.

### Jerarquía de Capas

```
app → pages → widgets → features → entities → shared
```

Cada capa solo puede importar de capas inferiores. Esto garantiza un flujo de dependencias unidireccional.

### Capas Explicadas

| Capa | Responsabilidad | Ejemplos |
|---|---|---|
| `app` | Setup global, providers, router, store | `ThemeProvider`, `LangProvider`, `router` |
| `pages` | Composiciones de página completa | `ConnectionsPage`, `LoginPage`, `NotFoundPage` |
| `widgets` | Bloques de UI complejos, layouts | `PublicLayout`, `DashboardLayout`, `AppSidebar` |
| `features` | Lógica de negocio + UI para acciones del usuario | `useConnectionCrud`, `ConnectionDialog` |
| `entities` | Modelos de dominio + componentes de visualización | `ConnectionCard`, `ContactCard` |
| `shared` | Utilidades reutilizables, UI, hooks, config | `useLang`, `LangSelector`, `ConfirmDialog` |

### Gestión de Estado

- **Redux Toolkit** para estado global de autenticación (slice `user`)
- **React Context** para modo de tema (`ThemeModeContext`)
- **React Context** para idioma (`LangContext`)
- **Estado local** (`useState`) para lógica específica de UI (diálogos, menús)
