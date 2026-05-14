# Primeros Pasos

## Requisitos Previos

- **Node.js** v18+
- **npm** v9+
- **Firebase CLI** instalado globalmente
- Un proyecto **Firebase** con Authentication y Firestore habilitados

## Instalación

```bash
git clone https://github.com/Vidigal-code/firebase-saas-auth.git
cd firebase-saas-auth
```

### Web (Frontend)

```bash
cd web
npm install
cp envexample.txt .env
```

Edita el `.env` con tus credenciales Firebase:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_START_LANG=pt
VITE_START_THEME=dark
```

### Cloud Functions (Backend)

```bash
cd functions
npm install
```

## Ejecutar Localmente

```bash
cd web
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Deploy en Firebase

```bash
npm run build
npx firebase-tools deploy --only firestore,hosting
```
