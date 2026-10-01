# Firebase SaaS Auth

## BroadcastApp

Aplicación **SaaS multi-tenant de Broadcast** construida con React, TypeScript, Material UI, Tailwind CSS y Firebase (Authentication, Firestore y Cloud Functions).

### Demo en línea

[https://fir-saas-auth-4a138.web.app/](https://fir-saas-auth-4a138.web.app/)

### Funcionalidades principales

- **Autenticación**: inicio de sesión, registro y cambio de contraseña con Firebase Authentication; cada usuario registrado es un cliente (tenant).
- **Conexiones**: CRUD completo; cada cliente ve solo sus propias conexiones.
- **Contactos**: CRUD de nombre y teléfono por conexión.
- **Broadcast**: selección de uno o varios contactos, envío inmediato o programado, edición, eliminación y filtro entre enviados y programados.
- **Programación en el backend**: la Cloud Function `dispatchScheduledMessages` cambia el estado de "Programado" a "Enviado" a la hora definida, sin depender de que la app esté abierta. Implementada y probada, pero **inactiva en la app publicada** (flag `VITE_SCHEDULED_DISPATCH_ENABLED=false`): publicar Cloud Functions requiere el plan Blaze de Firebase. Mientras la flag está apagada, la app avisa que el envío automático está inactivo y los mensajes programados se pueden enviar con "Editar → Enviar ahora".
- **Tiempo real**: todas las listas usan listeners `onSnapshot` de Firestore.
- **Aislamiento entre clientes**: garantizado por las reglas de Firestore y cubierto por pruebas automatizadas.
- **i18n y temas**: portugués, inglés y español; modo claro y oscuro.

### Stack

`React 19` · `TypeScript 6` · `Vite 8` · `MUI 9` · `Tailwind CSS 4` · `React Router 7` · `React Hook Form + Zod` · `Firebase Auth` · `Cloud Firestore` · `Cloud Functions v2 (Node 22)` · `Vitest`

### Repositorio

[github.com/Vidigal-code/firebase-saas-auth](https://github.com/Vidigal-code/firebase-saas-auth)
