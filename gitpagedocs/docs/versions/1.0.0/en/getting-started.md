# Getting started

## Prerequisites

- **Node.js 22** and npm 10+
- **Java 21+** (required by the Firestore emulator)
- **Firebase CLI** (`npm install --global firebase-tools`)
- A Firebase project on the **Blaze** plan (required for scheduled Cloud Functions) with Authentication (email/password) and Firestore enabled

## Installation

```bash
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth
npm run install:all
cp web/.env.example web/.env
```

Fill in `web/.env` with the Firebase web app configuration (`firebase apps:sdkconfig WEB`).

## Running locally with the emulators

```bash
npm run emulators            # Local Auth, Firestore, and Functions
npm --prefix web run dev:emulators
```

The app runs at `http://localhost:5173` and the emulator UI at `http://localhost:4000`.

> The Functions emulator does not run scheduled functions without the Pub/Sub emulator; automatic dispatch of scheduled messages is validated by the `functions/` tests and in production.

## Main scripts (root)

| Script | What it does |
|---|---|
| `npm run lint` | ESLint on `functions/` and `web/` |
| `npm run typecheck` | TypeScript for rules tests, functions, and web |
| `npm test` | Firestore rules, Cloud Functions, and web unit and integration tests |
| `npm run build` | Builds Functions and web |
| `npm run deploy` | Deploys rules, indexes, Functions, and Hosting |

Tests that need emulators run through `scripts/with-emulators.mjs`, which starts the required emulators and shuts them down at the end.
