# Firebase SaaS Auth

## BroadcastApp

A **multi-tenant SaaS Broadcast** application built with React, TypeScript, Material UI, Tailwind CSS, and Firebase (Authentication, Firestore, and Cloud Functions).

### Live demo

[https://fir-saas-auth-4a138.web.app/](https://fir-saas-auth-4a138.web.app/)

### Key features

- **Authentication**: login, sign-up, and password change with Firebase Authentication; each registered user is a client (tenant).
- **Connections**: full CRUD; each client sees only their own connections.
- **Contacts**: CRUD for name and phone per connection.
- **Broadcast**: select one or more contacts, send now or schedule, edit, delete, and filter between sent and scheduled.
- **Backend scheduling**: the `dispatchScheduledMessages` Cloud Function changes the status from "Scheduled" to "Sent" at the set time, without needing the app to be open.
- **Real time**: every list uses Firestore `onSnapshot` listeners.
- **Client isolation**: enforced by Firestore rules and covered by automated tests.
- **i18n and themes**: Portuguese, English, and Spanish; light and dark mode.

### Stack

`React 19` · `TypeScript 6` · `Vite 8` · `MUI 9` · `Tailwind CSS 4` · `React Router 7` · `React Hook Form + Zod` · `Firebase Auth` · `Cloud Firestore` · `Cloud Functions v2 (Node 22)` · `Vitest`

### Repository

[github.com/Vidigal-code/firebase-saas-auth](https://github.com/Vidigal-code/firebase-saas-auth)
