# Environment variables and deploy

## Frontend variables (`web/.env`)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_USE_EMULATORS` | `true` connects Auth and Firestore to the local emulators |
| `VITE_DEFAULT_LANG` | Initial language: `pt`, `en`, or `es` |

Variables are validated with Zod at startup: if one is missing, the app tells you which.

## Manual deploy

```bash
firebase login
npm run deploy
```

## Automatic deploy (GitHub Actions)

The `.github/workflows/firebase-deploy.yml` workflow runs on every push to `main`:

1. **quality**: lint, typecheck, tests (rules, Functions, web unit and integration with emulators), and build.
2. **deploy**: publishes Firestore rules and indexes, Cloud Functions, and Hosting.

Required GitHub configuration:

- **Variables** (`Settings → Secrets and variables → Actions → Variables`): the six `VITE_FIREBASE_*` variables above.
- **Secret** `FIREBASE_SERVICE_ACCOUNT`: JSON for a project service account with the *Firebase Admin*, *Cloud Functions Admin*, *Service Account User*, and *Cloud Scheduler Admin* roles.

Pull requests run only the quality job.
