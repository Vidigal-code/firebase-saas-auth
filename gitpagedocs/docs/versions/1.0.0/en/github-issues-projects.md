# Environment Variables

## Configuration File

Copy `envexample.txt` to `.env` in the `web/` directory.

## Required Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Project ID | `my-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender | `123456789` |
| `VITE_FIREBASE_APP_ID` | App ID | `1:123:web:abc` |
| `VITE_START_LANG` | Default language | `pt`, `en`, or `es` |
| `VITE_START_THEME` | Default theme | `dark` or `light` |

## How It Works

1. Firebase credentials connect the app to your Firebase project
2. `VITE_START_LANG` sets the initial language (persisted to `localStorage` after first visit)
3. `VITE_START_THEME` sets the initial theme mode (persisted to `localStorage` after first visit)
4. URL parameters (`?lang=en&theme=light`) override stored preferences
5. All `VITE_` prefixed variables are exposed to the client at build time via Vite
