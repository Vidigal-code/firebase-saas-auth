# Reglas Firestore y Seguridad

## Arquitectura Multi-Tenant

Los datos de cada usuario están completamente aislados. Las reglas de seguridad de Firestore garantizan que:

- Los usuarios solo pueden acceder a **sus propias** conexiones
- Las operaciones de contacto y mensaje requieren propiedad de la conexión padre
- Todas las operaciones de escritura validan campos obligatorios

## Modelo de Datos Firestore

```
users/{userId}/
├── connections/{connectionId}
│   ├── name: string
│   ├── status: "active" | "inactive"
│   ├── createdAt: timestamp
│   ├── contacts/{contactId}
│   │   ├── name: string
│   │   ├── phone: string
│   │   └── createdAt: timestamp
│   └── messages/{messageId}
│       ├── content: string
│       ├── status: "sent" | "scheduled"
│       ├── scheduledAt?: timestamp
│       └── createdAt: timestamp
```

## Protección de Rutas

### Guardias en el Frontend

| Guardia | Comportamiento |
|---|---|
| `PrivateRoute` | Redirige a `/login` si no autenticado |
| `GuestRoute` | Redirige a `/connections` si ya autenticado |

### Rutas Protegidas

| Ruta | Guardia | Acceso |
|---|---|---|
| `/` | `GuestRoute` | Solo público |
| `/login` | `GuestRoute` | Solo público |
| `/register` | `GuestRoute` | Solo público |
| `/connections` | `PrivateRoute` | Solo autenticado |
| `/connections/:id/contacts` | `PrivateRoute` | Solo autenticado |
| `/connections/:id/messages` | `PrivateRoute` | Solo autenticado |
| `*` (404) | Ninguno | Todos |

## Cloud Functions

Las Cloud Functions de Firebase manejan operaciones del servidor:

- **Programación de mensajes** con triggers de Firestore
- **Operaciones por lotes** para envío masivo
- Validación y sanitización de datos en la capa backend
