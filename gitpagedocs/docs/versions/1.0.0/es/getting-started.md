# Primeros pasos

## Requisitos previos

- **Node.js 22** y npm 10+
- **Java 21+** (necesario para el emulador de Firestore)
- **Firebase CLI** (`npm install --global firebase-tools`)
- Un proyecto Firebase en el plan **Blaze** (obligatorio para Cloud Functions programadas) con Authentication (correo/contraseña) y Firestore habilitados

## Instalación

```bash
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth
npm run install:all
cp web/.env.example web/.env
```

Completa `web/.env` con la configuración de la app web de Firebase (`firebase apps:sdkconfig WEB`).

## Ejecución local con los emuladores

```bash
npm run emulators            # Auth, Firestore y Functions locales
npm --prefix web run dev:emulators
```

La aplicación queda en `http://localhost:5173` y la interfaz de los emuladores en `http://localhost:4000`.

> El emulador de Functions no ejecuta funciones programadas sin el emulador de Pub/Sub; el disparo automático de los mensajes programados se valida con las pruebas de `functions/` y en producción.

## Scripts principales (raíz)

| Script | Qué hace |
|---|---|
| `npm run lint` | ESLint en `functions/` y `web/` |
| `npm run typecheck` | TypeScript de las pruebas de reglas, functions y web |
| `npm test` | Reglas de Firestore, Cloud Functions, pruebas unitarias y de integración del web |
| `npm run build` | Build de las Functions y del web |
| `npm run deploy` | Deploy de reglas, índices, Functions y Hosting |

Las pruebas que usan emuladores se ejecutan mediante `scripts/with-emulators.mjs`, que levanta los emuladores necesarios y los detiene al final.
