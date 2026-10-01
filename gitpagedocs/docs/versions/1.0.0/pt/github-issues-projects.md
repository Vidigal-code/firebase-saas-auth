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
| `VITE_SCHEDULED_DISPATCH_ENABLED` | Feature flag do disparo automático: `true` só depois de publicar as Cloud Functions (plano Blaze). Hoje `false` |

As variáveis são validadas com Zod na inicialização: se faltar alguma, o app informa qual.

## Deploy manual

```bash
firebase login
npm run deploy            # regras, índices e Hosting
npm run deploy:functions  # Cloud Functions (requer o plano Blaze)
```

## Deploy automático (GitHub Actions)

O workflow `.github/workflows/firebase-deploy.yml` roda a cada push na `main`:

1. **quality**: lint, typecheck, testes (regras, Functions, web unitário e integração com emuladores) e build.
2. **deploy**: publica regras e índices do Firestore e Hosting; as Cloud Functions só entram quando a variável `VITE_SCHEDULED_DISPATCH_ENABLED` do repositório é `true`. Só roda quando o secret `FIREBASE_SERVICE_ACCOUNT` existe.

Configuração necessária no GitHub:

- **Variables** (`Settings → Secrets and variables → Actions → Variables`): as seis variáveis `VITE_FIREBASE_*` acima.
- **Secret** `FIREBASE_SERVICE_ACCOUNT`: JSON de uma conta de serviço do projeto com os papéis *Firebase Admin*, *Cloud Functions Admin*, *Service Account User* e *Cloud Scheduler Admin*.

Pull requests executam apenas o job de qualidade.

## Plano Blaze (Cloud Functions)

Publicar Cloud Functions exige o plano **Blaze** (pague pelo que usar) do Firebase. Ele mantém as cotas gratuitas do plano Spark e só cobra o excedente, mas pede uma conta de faturamento (cartão). Para o uso deste app (~44 mil invocações por mês para 2 milhões gratuitas, 1 job do Cloud Scheduler para 3 gratuitos, algumas centenas de MB de imagens para 500 MB gratuitos), o custo esperado é zero. Crie um alerta de orçamento no Google Cloud para ser avisado de qualquer custo.

Explicação completa (o que é, custo e como ativar) na página **Plano Blaze**.
