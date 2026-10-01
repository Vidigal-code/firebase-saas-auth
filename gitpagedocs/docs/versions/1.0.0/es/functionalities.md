# Funcionalidades

## Autenticación

- Registro e inicio de sesión con correo y contraseña (Firebase Authentication).
- Política de contraseña: mínimo de 8 caracteres con mayúscula, minúscula, número y símbolo.
- Cambio de contraseña con reautenticación.
- Cada usuario registrado es un **cliente**; su `uid` es el `clientId` de todos sus datos.
- Rutas protegidas por `RequireAuth` y `RequireGuest`.

## Conexiones

- Crear, listar (tiempo real), renombrar y eliminar.
- Al eliminar una conexión, la Cloud Function `cleanupDeletedConnection` borra sus contactos y mensajes.

## Contactos

- Nombre y teléfono por conexión; el teléfono se normaliza (ej.: `+55 (11) 99999-8888` → `+5511999998888`) y se valida.
- Al eliminar un contacto, la Cloud Function `detachDeletedContact` lo quita de los destinatarios de los mensajes.

## Broadcast

- Selección de uno o varios contactos (búsqueda y "seleccionar todos").
- **Enviar ahora**: el mensaje se guarda como `sent` con la hora del servidor (simulación del envío).
- **Programar**: el mensaje queda `scheduled` hasta la hora elegida, que debe estar en el futuro.
- **Disparo automático**: la Cloud Function `dispatchScheduledMessages` se ejecuta cada minuto y cambia a `sent` todo mensaje cuya hora llegó, incluso con la app cerrada. La actualización aparece en pantalla en tiempo real. Implementada y probada, pero **inactiva en la app publicada** (flag `VITE_SCHEDULED_DISPATCH_ENABLED=false`): publicar Cloud Functions requiere el plan Blaze de Firebase. Mientras la flag está apagada, la app avisa que el envío automático está inactivo y los mensajes programados se pueden enviar con "Editar → Enviar ahora".
- Filtros **Todos / Enviados / Programados** con contadores.
- Edición: los mensajes programados pueden cambiar texto, contactos y hora (o enviarse ahora); los mensajes enviados solo cambian texto y contactos.
- Eliminación con confirmación.

## Experiencia

- Interfaz en portugués, inglés y español (`?lang=en` también funciona).
- Tema claro y oscuro.
- 100% responsivo: por debajo de 900px la barra superior se convierte en un menú hamburguesa (navegación, cuenta, idioma y tema); por debajo de 600px el contenido queda centrado y apilado, y los diálogos ocupan toda la pantalla.
- Feedback con notificaciones y estados de carga, error y vacío.
