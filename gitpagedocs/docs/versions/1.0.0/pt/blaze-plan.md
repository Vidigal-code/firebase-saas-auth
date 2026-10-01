# Plano Blaze do Firebase

> O app está publicado e funcionando, mas a mudança automática de **"Agendada" para "Enviada"** depende de Cloud Functions, e o Firebase só publica Cloud Functions no plano **Blaze**. O código está pronto e testado e fica desligado pela flag `VITE_SCHEDULED_DISPATCH_ENABLED`=false até o upgrade.

## Spark × Blaze

| | **Spark** (atual) | **Blaze** |
|---|---|---|
| Preço | Gratuito | Pague pelo que usar |
| Cotas gratuitas | Sim | As mesmas do Spark; só cobra o que passar delas |
| Cartão de crédito | Não precisa | Precisa de uma conta de faturamento |
| Hosting, Auth, Firestore | ✅ | ✅ |
| Cloud Functions | ❌ | ✅ |
| Cloud Scheduler | ❌ | ✅ |

## Por que este projeto precisa dele

O desafio pede que a mensagem agendada mude para "Enviada" no backend, com Cloud Functions, sem depender do app aberto. Quem faz isso é a função `dispatchScheduledMessages`, a cada minuto. As funções `cleanupDeletedConnection` e `detachDeletedContact`, da limpeza em cascata, também dependem do Blaze.

## Quanto custa

O custo esperado para este app é **zero**, porque o uso fica abaixo das cotas gratuitas mensais. Os valores vêm de [firebase.google.com/pricing](https://firebase.google.com/pricing) e podem mudar.

| Recurso | Uso estimado | Gratuito por mês |
|---|---|---|
| Invocações de Cloud Functions | ~44 mil | 2 milhões |
| Tempo de execução | poucos milhares de GB-s | 400 mil GB-s |
| Imagens das Functions (Artifact Registry) | algumas centenas de MB | 500 MB |
| Cloud Scheduler | 1 job | 3 jobs |
| Firestore | uso de teste | 50 mil leituras e 20 mil gravações por dia |
| Hosting | ~1,5 MB por visita | 360 MB/dia |

## Como ativar

1. Abra https://console.firebase.google.com/project/fir-saas-auth-4a138/usage/details e confira que o projeto é **fir-saas-auth-4a138**.
2. Clique em **Modify plan**, escolha **Blaze** e vincule uma conta de faturamento.
3. Se continuar aparecendo Spark, confira a conta vinculada em https://console.cloud.google.com/billing/linkedaccount?project=fir-saas-auth-4a138.
4. Ligue a flag `VITE_SCHEDULED_DISPATCH_ENABLED`="true" em `web/.env` e no repositório (`gh variable set VITE_SCHEDULED_DISPATCH_ENABLED --body true`).
5. Publique com `npm run deploy:functions && npm run deploy`.

## Como evitar surpresas

- Crie um alerta de orçamento em https://console.cloud.google.com/billing/budgets (por exemplo, US$ 1). O alerta avisa por e-mail, mas não bloqueia a cobrança.
- Para voltar ao gratuito: desligue a flag, remova as funções com `npx firebase functions:delete` e rebaixe para Spark.
