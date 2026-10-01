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
| `VITE_SCHEDULED_DISPATCH_ENABLED` | Automatic dispatch feature flag: `true` only after the Cloud Functions are deployed (Blaze plan). Currently `false` |

Variables are validated with Zod at startup: if one is missing, the app tells you which.

## Manual deploy

```bash
firebase login
npm run deploy            # rules, indexes and Hosting
npm run deploy:functions  # Cloud Functions (requires the Blaze plan)
```

## Automatic deploy (GitHub Actions)

The `.github/workflows/firebase-deploy.yml` workflow runs on every push to `main`:

1. **quality**: lint, typecheck, tests (rules, Functions, web unit and integration with emulators), and build.
2. **deploy**: publishes Firestore rules and indexes and Hosting; Cloud Functions are included only when the repository variable `VITE_SCHEDULED_DISPATCH_ENABLED` is `true`. It only runs when the `FIREBASE_SERVICE_ACCOUNT` secret exists.

Required GitHub configuration:

- **Variables** (`Settings → Secrets and variables → Actions → Variables`): the six `VITE_FIREBASE_*` variables above.
- **Secret** `FIREBASE_SERVICE_ACCOUNT`: JSON for a project service account with the *Firebase Admin*, *Cloud Functions Admin*, *Service Account User*, and *Cloud Scheduler Admin* roles.

Pull requests run only the quality job.

## Blaze plan (Cloud Functions)

Deploying Cloud Functions requires the Firebase **Blaze** (pay as you go) plan. It keeps the Spark free quotas and only bills usage above them, but it requires a billing account (credit card). For this app (~44 thousand invocations per month against 2 million free, 1 Cloud Scheduler job against 3 free, a few hundred MB of images against 500 MB free) the expected cost is zero. Create a budget alert in Google Cloud to be notified of any cost.

While the project is on Spark, the `VITE_SCHEDULED_DISPATCH_ENABLED` flag stays `false`: the Functions are implemented and tested but not deployed, and the app shows that automatic dispatch is inactive. To enable it: upgrade at `console.firebase.google.com/project/<project>/usage/details`, set the flag to `true` and run `npm run deploy:functions`.
