# Firestore rules and security

## Data model (no subcollections)

| Collection | Fields |
|---|---|
| `users/{uid}` | `email`, `createdAt` |
| `connections/{id}` | `clientId`, `name`, `createdAt`, `updatedAt` |
| `contacts/{id}` | `clientId`, `connectionId`, `name`, `phone`, `createdAt`, `updatedAt` |
| `messages/{id}` | `clientId`, `connectionId`, `contactIds[]`, `content`, `status`, `scheduledAt`, `sentAt`, `createdAt`, `updatedAt` |

Every document carries the `clientId` (the owner's `uid`). Contacts and messages also carry the `connectionId`, so queries filter by `clientId` + `connectionId` without needing subcollections.

## Isolation strategy

1. **Read**: allowed only if `resource.data.clientId == request.auth.uid`. Queries without the `where('clientId', '==', uid)` filter are rejected.
2. **Create**: the submitted `clientId` must be the authenticated user's, and the `connectionId` must point to a connection **owned by that same client** (checked with `get()`).
3. **Update**: `clientId` and `connectionId` are immutable (`diff().affectedKeys()`), which prevents moving data to another client.
4. **Schema validation**: exact fields (`hasOnly`), non-empty strings with length limits, phone by regex, 1 to 200 recipients.
5. **Server timestamps**: `createdAt`, `updatedAt`, and `sentAt` must be `request.time`.
6. **Message lifecycle**:
   - created as `sent` (with `sentAt = request.time`) or as `scheduled` with `scheduledAt` in the future;
   - a scheduled message can be rescheduled or sent now;
   - a sent message keeps its status and delivery timestamps;
   - only the Cloud Function (Admin SDK) performs the automatic transition at the scheduled time.

## Tests

- `tests/firestore.rules.test.ts`: 25 scenarios on the emulator (another client cannot read, edit, delete, or reference someone else's data; schema; lifecycle).
- `web/src/test/tenantFlow.integration.test.ts`: the app's real repositories against the Auth and Firestore emulators, including cross-client access denial.

## Frontend routes

- `RequireAuth`: `/connections`, `/connections/:id/contacts`, `/connections/:id/broadcast`.
- `RequireGuest`: `/`, `/login`, `/register`.
- Opening another client's connection by URL shows "Connection not found": the read is denied by the rules.
