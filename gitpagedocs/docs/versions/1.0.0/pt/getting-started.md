# Primeiros passos

## Pré-requisitos

- **Node.js 22** e npm 10+
- **Java 21+** (necessário para o emulador do Firestore)
- **Firebase CLI** (`npm install --global firebase-tools`)
- Um projeto Firebase no plano **Blaze** (obrigatório para Cloud Functions agendadas) com Authentication (e-mail/senha) e Firestore habilitados

## Instalação

```bash
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth
npm run install:all
cp web/.env.example web/.env
```

Preencha `web/.env` com a configuração do app web do Firebase (`firebase apps:sdkconfig WEB`).

## Rodando localmente com os emuladores

```bash
npm run emulators            # Auth, Firestore e Functions locais
npm --prefix web run dev:emulators
```

A aplicação fica em `http://localhost:5173` e a interface dos emuladores em `http://localhost:4000`.

> O emulador de Functions não executa funções agendadas sem o emulador de Pub/Sub; o disparo automático das mensagens agendadas é validado pelos testes de `functions/` e em produção.

## Scripts principais (raiz)

| Script | O que faz |
|---|---|
| `npm run lint` | ESLint em `functions/` e `web/` |
| `npm run typecheck` | TypeScript de testes de regras, functions e web |
| `npm test` | Regras do Firestore, Cloud Functions, testes unitários e de integração do web |
| `npm run build` | Build das Functions e do web |
| `npm run deploy` | Deploy de regras, índices, Functions e Hosting |

Os testes que usam emuladores rodam por meio de `scripts/with-emulators.mjs`, que sobe os emuladores necessários e os encerra ao final.
