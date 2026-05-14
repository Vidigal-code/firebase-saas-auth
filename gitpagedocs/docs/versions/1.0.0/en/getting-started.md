# Getting Started

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Firebase CLI** installed globally
- A **Firebase** project with Authentication and Firestore enabled

## Installation

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

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_START_LANG=pt
VITE_START_THEME=dark
```

### Cloud Functions (Backend)

```bash
cd functions
npm install
```

## Running Locally

```bash
cd web
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deploy to Firebase

```bash
npm run build
npx firebase-tools deploy --only firestore,hosting
```
