# Reglas de Firestore y seguridad

## Modelo de datos (sin subcolecciones)

| Colección | Campos |
|---|---|
| `users/{uid}` | `email`, `createdAt` |
| `connections/{id}` | `clientId`, `name`, `createdAt`, `updatedAt` |
| `contacts/{id}` | `clientId`, `connectionId`, `name`, `phone`, `createdAt`, `updatedAt` |
| `messages/{id}` | `clientId`, `connectionId`, `contactIds[]`, `content`, `status`, `scheduledAt`, `sentAt`, `createdAt`, `updatedAt` |

Todo documento lleva el `clientId` (el `uid` del dueño). Los contactos y mensajes también llevan el `connectionId`, así que las consultas filtran por `clientId` + `connectionId` sin necesidad de subcolecciones.

## Estrategia de aislamiento

1. **Lectura**: solo se permite si `resource.data.clientId == request.auth.uid`. Las consultas sin el filtro `where('clientId', '==', uid)` se rechazan.
2. **Creación**: el `clientId` enviado debe ser el del usuario autenticado, y el `connectionId` debe apuntar a una conexión **del propio cliente** (verificado con `get()`).
3. **Actualización**: `clientId` y `connectionId` son inmutables (`diff().affectedKeys()`), lo que impide transferir datos a otro cliente.
4. **Validación de esquema**: campos exactos (`hasOnly`), textos no vacíos con límite de longitud, teléfono por regex, de 1 a 200 destinatarios.
5. **Fechas del servidor**: `createdAt`, `updatedAt` y `sentAt` deben ser `request.time`.
6. **Ciclo de vida del mensaje**:
   - creación como `sent` (con `sentAt = request.time`) o como `scheduled` con `scheduledAt` en el futuro;
   - un mensaje programado puede reprogramarse o enviarse ahora;
   - un mensaje enviado mantiene su estado y fechas de entrega;
   - solo la Cloud Function (Admin SDK) hace la transición automática a la hora programada.

## Pruebas

- `tests/firestore.rules.test.ts`: 25 escenarios en el emulador (otro cliente no lee, no edita, no elimina y no referencia datos ajenos; esquema; ciclo de vida).
- `web/src/test/tenantFlow.integration.test.ts`: los repositorios reales de la app contra los emuladores de Auth y Firestore, incluida la denegación de acceso entre clientes.

## Rutas del frontend

- `RequireAuth`: `/connections`, `/connections/:id/contacts`, `/connections/:id/broadcast`.
- `RequireGuest`: `/`, `/login`, `/register`.
- Acceder a la conexión de otro cliente por la URL muestra "Conexión no encontrada": las reglas deniegan la lectura.
