# Architecture

## Frontend: Feature-Sliced Design

```
web/src/
├── app/        # Providers (theme, i18n, session, notifications), routes, and global styles
├── pages/      # Screens: home, login, sign-up, connections, contacts, broadcast, 404
├── widgets/    # Layouts: app shell (top bar, account menu) and connection layout (tabs)
├── features/   # Use cases: auth, connection/contact editors, message composer and filter
├── entities/   # Models, Firestore repositories, and hooks: session, connection, contact, message
└── shared/     # Firebase, i18n, theme, hooks, and generic components
```

- **Repositories** (`entities/*/api`) centralize Firestore access: typed queries with converters and write functions with explicit payloads.
- **Real time**: `useRealtimeQuery` and `useRealtimeDocument` subscribe to queries with `onSnapshot` and never display data from a previous query.
- **State**: the session comes from `onAuthStateChanged` (React context); data comes straight from Firestore listeners, with no extra global cache.
- **Styling**: Material UI components, styled with Tailwind classes. The CSS layers (`theme, base, mui, components, utilities`) give Tailwind precedence, and the MUI theme colors become Tailwind utilities (`bg-background-paper`, `text-primary`...).

## Backend: Cloud Functions

```
functions/src/
├── index.ts                    # Function registration
├── messages/dispatchDueMessages.ts
├── cascade/deleteConnectionData.ts
├── cascade/detachContactFromMessages.ts
├── lib/                        # Pagination and batch writes (BulkWriter)
├── domain/                     # Collections, fields, and statuses
└── config/runtime.ts           # Region, schedule, and page size
```

| Function | Trigger | Responsibility |
|---|---|---|
| `dispatchScheduledMessages` | Schedule (every 1 min) | Changes `scheduled` → `sent` when `scheduledAt <= now` |
| `cleanupDeletedConnection` | `connections/{id}` deleted | Removes the connection's contacts and messages |
| `detachDeletedContact` | `contacts/{id}` deleted | Removes the contact from messages' `contactIds` |

Dispatch uses a precondition (`lastUpdateTime`): if the client edits the message at the same moment, the write is discarded and the message is reevaluated the next minute.
