# Variáveis de ambiente e deploy

## Variáveis do frontend (`web/.env`)

| Variável | Descrição |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key do app web |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket do Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_USE_EMULATORS` | `true` conecta Auth e Firestore aos emuladores locais |
| `VITE_DEFAULT_LANG` | Idioma inicial: `pt`, `en` ou `es` |

As variáveis são validadas com Zod na inicialização: se faltar alguma, o app informa qual.

## Deploy manual

```bash
firebase login
npm run deploy
```

## Deploy automático (GitHub Actions)

O workflow `.github/workflows/firebase-deploy.yml` roda a cada push na `main`:

1. **quality**: lint, typecheck, testes (regras, Functions, web unitário e integração com emuladores) e build.
2. **deploy**: publica regras e índices do Firestore, Cloud Functions e Hosting.

Configuração necessária no GitHub:

- **Variables** (`Settings → Secrets and variables → Actions → Variables`): as seis variáveis `VITE_FIREBASE_*` acima.
- **Secret** `FIREBASE_SERVICE_ACCOUNT`: JSON de uma conta de serviço do projeto com os papéis *Firebase Admin*, *Cloud Functions Admin*, *Service Account User* e *Cloud Scheduler Admin*.

Pull requests executam apenas o job de qualidade.
