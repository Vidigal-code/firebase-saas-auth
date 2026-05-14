# Arquitetura

## Feature-Sliced Design (FSD)

A aplicação segue a metodologia **Feature-Sliced Design**, garantindo isolamento estrito de camadas e máxima reutilização de código.

### Hierarquia de Camadas

```
app → pages → widgets → features → entities → shared
```

Cada camada só pode importar de camadas abaixo dela. Isso garante fluxo de dependência unidirecional.

### Camadas Explicadas

| Camada | Responsabilidade | Exemplos |
|---|---|---|
| `app` | Setup global, providers, router, store | `ThemeProvider`, `LangProvider`, `router` |
| `pages` | Composições de página completa | `ConnectionsPage`, `LoginPage`, `NotFoundPage` |
| `widgets` | Blocos de UI complexos, layouts | `PublicLayout`, `DashboardLayout`, `AppSidebar` |
| `features` | Lógica de negócio + UI para ações do usuário | `useConnectionCrud`, `ConnectionDialog` |
| `entities` | Modelos de domínio + componentes de exibição | `ConnectionCard`, `ContactCard` |
| `shared` | Utilitários reutilizáveis, UI, hooks, config | `useLang`, `LangSelector`, `ConfirmDialog` |

### Gerenciamento de Estado

- **Redux Toolkit** para estado global de autenticação (slice `user`)
- **React Context** para modo de tema (`ThemeModeContext`)
- **React Context** para idioma (`LangContext`)
- **Estado local** (`useState`) para lógica específica de UI (dialogs, menus)
