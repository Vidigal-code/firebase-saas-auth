# Variables de entorno y deploy

## Variables del frontend (`web/.env`)

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key de la app web |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_USE_EMULATORS` | `true` conecta Auth y Firestore a los emuladores locales |
| `VITE_DEFAULT_LANG` | Idioma inicial: `pt`, `en` o `es` |

Las variables se validan con Zod al iniciar: si falta alguna, la app indica cuál.

## Deploy manual

```bash
firebase login
npm run deploy
```

## Deploy automático (GitHub Actions)

El workflow `.github/workflows/firebase-deploy.yml` se ejecuta en cada push a `main`:

1. **quality**: lint, typecheck, pruebas (reglas, Functions, web unitario e integración con emuladores) y build.
2. **deploy**: publica reglas e índices de Firestore, Cloud Functions y Hosting.

Configuración necesaria en GitHub:

- **Variables** (`Settings → Secrets and variables → Actions → Variables`): las seis variables `VITE_FIREBASE_*` de arriba.
- **Secret** `FIREBASE_SERVICE_ACCOUNT`: JSON de una cuenta de servicio del proyecto con los roles *Firebase Admin*, *Cloud Functions Admin*, *Service Account User* y *Cloud Scheduler Admin*.

Los pull requests ejecutan solo el job de calidad.
