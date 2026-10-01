# Firebase Blaze plan

> The app is published and working, but the automatic switch from **"Scheduled" to "Sent"** relies on Cloud Functions, and Firebase only deploys Cloud Functions on the **Blaze** plan. The code is ready and tested and stays off through the `VITE_SCHEDULED_DISPATCH_ENABLED`=false flag until the upgrade.

## Spark vs Blaze

| | **Spark** (current) | **Blaze** |
|---|---|---|
| Price | Free | Pay as you go |
| Free quotas | Yes | The same as Spark; only usage above them is billed |
| Credit card | Not needed | Requires a billing account |
| Hosting, Auth, Firestore | ✅ | ✅ |
| Cloud Functions | ❌ | ✅ |
| Cloud Scheduler | ❌ | ✅ |

## Why this project needs it

The challenge requires scheduled messages to become "Sent" on the backend, with Cloud Functions, without the app being open. The `dispatchScheduledMessages` function does that every minute. The cascade cleanup functions `cleanupDeletedConnection` and `detachDeletedContact` also need Blaze.

## How much it costs

The expected cost for this app is **zero**, because usage stays below the monthly free quotas. Values come from [firebase.google.com/pricing](https://firebase.google.com/pricing) and may change.

| Resource | Estimated usage | Free per month |
|---|---|---|
| Cloud Functions invocations | ~44 thousand | 2 million |
| Compute time | a few thousand GB-s | 400 thousand GB-s |
| Function images (Artifact Registry) | a few hundred MB | 500 MB |
| Cloud Scheduler | 1 job | 3 jobs |
| Firestore | test usage | 50 thousand reads and 20 thousand writes per day |
| Hosting | ~1.5 MB per visit | 360 MB/day |

## How to enable it

1. Open https://console.firebase.google.com/project/fir-saas-auth-4a138/usage/details and check that the project is **fir-saas-auth-4a138**.
2. Click **Modify plan**, choose **Blaze** and link a billing account.
3. If it still shows Spark, check the linked account at https://console.cloud.google.com/billing/linkedaccount?project=fir-saas-auth-4a138.
4. Turn on `VITE_SCHEDULED_DISPATCH_ENABLED`="true" in `web/.env` and in the repository (`gh variable set VITE_SCHEDULED_DISPATCH_ENABLED --body true`).
5. Deploy with `npm run deploy:functions && npm run deploy`.

## Avoiding surprises

- Create a budget alert at https://console.cloud.google.com/billing/budgets (for example, US$ 1). It emails you but does not block charges.
- To go back to free: turn the flag off, delete the functions with `npx firebase functions:delete` and downgrade to Spark.
