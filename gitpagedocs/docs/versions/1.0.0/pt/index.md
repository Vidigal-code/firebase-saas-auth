# Firebase SaaS Auth

## BroadcastApp

Aplicação **SaaS multi-tenant de Broadcast** construída com React, TypeScript, Material UI, Tailwind CSS e Firebase (Authentication, Firestore e Cloud Functions).

### Demo online

[https://fir-saas-auth-4a138.web.app/](https://fir-saas-auth-4a138.web.app/)

### Principais funcionalidades

- **Autenticação**: login, cadastro e troca de senha com Firebase Authentication; cada usuário cadastrado é um cliente (tenant).
- **Conexões**: CRUD completo; cada cliente vê apenas as próprias conexões.
- **Contatos**: CRUD de nome e telefone por conexão.
- **Broadcast**: seleção de um ou vários contatos, envio imediato ou agendado, edição, exclusão e filtro entre enviadas e agendadas.
- **Agendamento no backend**: a Cloud Function `dispatchScheduledMessages` muda o status de "Agendada" para "Enviada" no horário definido, sem depender do app aberto.
- **Tempo real**: todas as listas usam listeners `onSnapshot` do Firestore.
- **Isolamento entre clientes**: garantido pelas regras do Firestore e coberto por testes automatizados.
- **i18n e temas**: Português, Inglês e Espanhol; modo claro e escuro.

### Stack

`React 19` · `TypeScript 6` · `Vite 8` · `MUI 9` · `Tailwind CSS 4` · `React Router 7` · `React Hook Form + Zod` · `Firebase Auth` · `Cloud Firestore` · `Cloud Functions v2 (Node 22)` · `Vitest`

### Repositório

[github.com/Vidigal-code/firebase-saas-auth](https://github.com/Vidigal-code/firebase-saas-auth)
