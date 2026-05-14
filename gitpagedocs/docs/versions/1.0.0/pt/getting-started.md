# Primeiros Passos

## Pré-requisitos

- **Node.js** v18+
- **npm** v9+
- **Firebase CLI** instalado globalmente
- Um projeto **Firebase** com Authentication e Firestore habilitados

## Instalação

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

Edite o `.env` com suas credenciais Firebase:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
VITE_START_LANG=pt
VITE_START_THEME=dark
```

### Cloud Functions (Backend)

```bash
cd functions
npm install
```

## Executando Localmente

```bash
cd web
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Deploy no Firebase

```bash
npm run build
npx firebase-tools deploy --only firestore,hosting
```
