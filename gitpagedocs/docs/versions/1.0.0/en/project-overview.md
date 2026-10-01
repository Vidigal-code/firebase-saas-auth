# Project overview

## Repository structure

```
firebase-saas-auth/
├── functions/              # Cloud Functions (scheduling and cascade cleanup)
├── web/                    # React + Vite frontend
├── tests/                  # Firestore rules tests (emulator)
├── scripts/                # Utilities (running tests with emulators)
├── firestore.rules         # Multi-tenant isolation and data validation
├── firestore.indexes.json  # Composite indexes for queries
├── firebase.json           # Hosting, Functions, Firestore, and emulators
└── .github/workflows/      # CI/CD (tests + automatic deploy)
```

## Stack

| Layer | Technology |
|---|---|
| UI | React 19, Material UI 9 (components), Tailwind CSS 4 (styling) |
| Build | Vite 8 |
| Routing | React Router 7 |
| Forms | React Hook Form + Zod |
| Backend | Firebase Authentication, Cloud Firestore, Cloud Functions v2 (Node 22) |
| Testing | Vitest, Testing Library, `@firebase/rules-unit-testing`, Firebase emulators |
| Quality | ESLint (typescript-eslint strict), SonarQube |

## Principles

- **Functional paradigm**: no classes; components, hooks, and pure functions.
- **Single source of truth**: collection names, validation limits, routes, and theme tokens live in constants; colors are defined once in the MUI theme and exposed to Tailwind through CSS variables.
- **Server-side security**: client isolation is enforced by Firestore rules, not just by the UI.
- **Real time**: lists kept in sync with `onSnapshot`.
- **TDD**: rules, Functions, and frontend domain covered by automated tests.
