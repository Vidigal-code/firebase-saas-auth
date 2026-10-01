# Arquitectura

## Frontend: Feature-Sliced Design

```
web/src/
├── app/        # Providers (tema, i18n, sesión, notificaciones), rutas y estilos globales
├── pages/      # Pantallas: inicio, login, registro, conexiones, contactos, broadcast, 404
├── widgets/    # Layouts: app shell (barra superior, menú de la cuenta) y layout de la conexión (pestañas)
├── features/   # Casos de uso: auth, editores de conexión/contacto, compositor y filtro de mensajes
├── entities/   # Modelos, repositorios de Firestore y hooks: session, connection, contact, message
└── shared/     # Firebase, i18n, tema, hooks y componentes genéricos
```

- **Repositorios** (`entities/*/api`) concentran el acceso a Firestore: consultas tipadas con conversores y funciones de escritura con payloads explícitos.
- **Tiempo real**: `useRealtimeQuery` y `useRealtimeDocument` se suscriben a consultas con `onSnapshot` y nunca muestran datos de una consulta anterior.
- **Estado**: la sesión viene de `onAuthStateChanged` (contexto de React); los datos vienen directamente de los listeners de Firestore, sin caché global adicional.
- **Estilo**: componentes de Material UI, estilizados con clases de Tailwind. Las capas CSS (`theme, base, mui, components, utilities`) dan prioridad a Tailwind, y los colores del tema de MUI se convierten en utilidades de Tailwind (`bg-background-paper`, `text-primary`...).

## Backend: Cloud Functions

```
functions/src/
├── index.ts                    # Registro de las funciones
├── messages/dispatchDueMessages.ts
├── cascade/deleteConnectionData.ts
├── cascade/detachContactFromMessages.ts
├── lib/                        # Paginación y escritura por lotes (BulkWriter)
├── domain/                     # Colecciones, campos y estados
└── config/runtime.ts           # Región, programación y tamaño de página
```

| Función | Disparador | Responsabilidad |
|---|---|---|
| `dispatchScheduledMessages` | Programación (cada 1 min) | Cambia `scheduled` → `sent` cuando `scheduledAt <= ahora` |
| `cleanupDeletedConnection` | `connections/{id}` eliminado | Borra los contactos y mensajes de la conexión |
| `detachDeletedContact` | `contacts/{id}` eliminado | Quita el contacto de `contactIds` de los mensajes |

El disparo usa una precondición (`lastUpdateTime`): si el cliente edita el mensaje en el mismo instante, la escritura se descarta y el mensaje se reevalúa en el minuto siguiente.
