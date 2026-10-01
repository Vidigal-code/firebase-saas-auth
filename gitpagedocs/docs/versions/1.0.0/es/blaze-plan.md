# Plan Blaze de Firebase

> La app está publicada y funcionando, pero el cambio automático de **"Programado" a "Enviado"** depende de Cloud Functions, y Firebase solo publica Cloud Functions en el plan **Blaze**. El código está listo y probado y queda apagado con la flag `VITE_SCHEDULED_DISPATCH_ENABLED`=false hasta el upgrade.

## Spark vs Blaze

| | **Spark** (actual) | **Blaze** |
|---|---|---|
| Precio | Gratis | Pago por uso |
| Cuotas gratuitas | Sí | Las mismas de Spark; solo se cobra lo que las supere |
| Tarjeta de crédito | No hace falta | Requiere una cuenta de facturación |
| Hosting, Auth, Firestore | ✅ | ✅ |
| Cloud Functions | ❌ | ✅ |
| Cloud Scheduler | ❌ | ✅ |

## Por qué este proyecto lo necesita

El desafío pide que los mensajes programados pasen a "Enviado" en el backend, con Cloud Functions, sin depender de la app abierta. Lo hace la función `dispatchScheduledMessages`, cada minuto. Las funciones de limpieza en cascada `cleanupDeletedConnection` y `detachDeletedContact` también requieren Blaze.

## Cuánto cuesta

El costo esperado para esta app es **cero**, porque el uso queda por debajo de las cuotas gratuitas mensuales. Los valores vienen de [firebase.google.com/pricing](https://firebase.google.com/pricing) y pueden cambiar.

| Recurso | Uso estimado | Gratis por mes |
|---|---|---|
| Invocaciones de Cloud Functions | ~44 mil | 2 millones |
| Tiempo de ejecución | algunos miles de GB-s | 400 mil GB-s |
| Imágenes de las Functions (Artifact Registry) | algunos cientos de MB | 500 MB |
| Cloud Scheduler | 1 job | 3 jobs |
| Firestore | uso de prueba | 50 mil lecturas y 20 mil escrituras por día |
| Hosting | ~1,5 MB por visita | 360 MB/día |

## Cómo activarlo

1. Abre https://console.firebase.google.com/project/fir-saas-auth-4a138/usage/details y confirma que el proyecto es **fir-saas-auth-4a138**.
2. Haz clic en **Modify plan**, elige **Blaze** y vincula una cuenta de facturación.
3. Si sigue apareciendo Spark, revisa la cuenta vinculada en https://console.cloud.google.com/billing/linkedaccount?project=fir-saas-auth-4a138.
4. Activa `VITE_SCHEDULED_DISPATCH_ENABLED`="true" en `web/.env` y en el repositorio (`gh variable set VITE_SCHEDULED_DISPATCH_ENABLED --body true`).
5. Publica con `npm run deploy:functions && npm run deploy`.

## Cómo evitar sorpresas

- Crea una alerta de presupuesto en https://console.cloud.google.com/billing/budgets (por ejemplo, US$ 1). Avisa por correo, pero no bloquea los cargos.
- Para volver al plan gratis: apaga la flag, elimina las funciones con `npx firebase functions:delete` y vuelve a Spark.
