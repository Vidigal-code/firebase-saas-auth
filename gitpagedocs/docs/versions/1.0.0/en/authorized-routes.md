# Firestore Rules & Security

## Multi-Tenant Architecture

Each user's data is completely isolated. The Firestore security rules ensure that:

- Users can only access **their own** connections
- Contact and message operations require ownership of the parent connection
- All write operations validate required fields

## Firestore Data Model

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

## Route Protection

### Frontend Guards

| Guard | Behavior |
|---|---|
| `PrivateRoute` | Redirects to `/login` if not authenticated |
| `GuestRoute` | Redirects to `/connections` if already authenticated |

### Protected Routes

| Route | Guard | Access |
|---|---|---|
| `/` | `GuestRoute` | Public only |
| `/login` | `GuestRoute` | Public only |
| `/register` | `GuestRoute` | Public only |
| `/connections` | `PrivateRoute` | Authenticated only |
| `/connections/:id/contacts` | `PrivateRoute` | Authenticated only |
| `/connections/:id/messages` | `PrivateRoute` | Authenticated only |
| `*` (404) | None | Everyone |

## Cloud Functions

Firebase Cloud Functions handle server-side operations:

- **Message scheduling** with Firestore triggers
- **Batch operations** for mass message delivery
- Data validation and sanitization at the backend layer
