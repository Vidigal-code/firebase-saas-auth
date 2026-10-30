# Blaze Plan

Multiuser broadcast SaaS. Each account manages its own connections, contacts and messages. Sending is simulated: marking a message sent does not deliver WhatsApp, SMS or email. This guide describes the source; verify billing and deployed functions in Firebase.

## Data contracts

firestore.rules requires the authenticated owner, server timestamps, allowed schema and an owned connection. Names are limited to 80, content to 1000, recipients to 1–200; phones follow the rule pattern. Rules do not validate each contact ID individually: do not claim stronger referential integrity. UI guards do not replace rules. Public Firebase configuration is not an admin credential; service-account secrets stay outside the frontend.

## Workflow and failure cases

Registration/login → Firebase Auth → SessionProvider → route guard → uid-scoped queries. Profiles use users/{uid}; connections, contacts and messages are flat collections with clientId. Lists use onSnapshot for real-time UI updates.

Use Node 22 and Java 21+ for emulators. Run install:all, copy web/.env.example, run npm run build to generate functions/lib and web/dist, then start emulators and web dev:emulators. The demo-broadcast project avoids production data. Run root lint, typecheck, test and build. For permission-denied check clientId and connection ownership; for missing indexes check firestore.indexes.json; for stalled schedules check deployment, logs and the flag. Production Cloud Functions require billing; check Firebase documentation before enabling costs. firebase-deploy is separate from GitPageDocs.

## Related files

- [firestore.rules](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firestore.rules)
- [firebase.json](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firebase.json)
- [firestore.indexes.json](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firestore.indexes.json)
- [functions/src/index.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/functions/src/index.ts)
- [functions/src/messages/dispatchDueMessages.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/functions/src/messages/dispatchDueMessages.ts)
- [web/src/entities/message/api/messagesRepository.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/web/src/entities/message/api/messagesRepository.ts)
- [.github/workflows/firebase-deploy.yml](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/.github/workflows/firebase-deploy.yml)

## Navigation

- [Project guide](?menu=en&lang=en&id=8)
- [Source reference](?menu=en&lang=en&id=9)

[Firebase Functions](https://firebase.google.com/docs/functions/get-started) · [Firebase pricing](https://firebase.google.com/pricing)
