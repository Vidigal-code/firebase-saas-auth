# Variables de Entorno

## Archivo de Configuración

Copia `envexample.txt` a `.env` en el directorio `web/`.

## Variables Obligatorias

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Clave API de Firebase | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación | `proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto | `mi-proyecto-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento | `proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID del sender | `123456789` |
| `VITE_FIREBASE_APP_ID` | ID del app | `1:123:web:abc` |
| `VITE_START_LANG` | Idioma predeterminado | `pt`, `en` o `es` |
| `VITE_START_THEME` | Tema predeterminado | `dark` o `light` |

## Cómo Funciona

1. Las credenciales Firebase conectan la app a tu proyecto Firebase
2. `VITE_START_LANG` define el idioma inicial (guardado en `localStorage` después de la primera visita)
3. `VITE_START_THEME` define el tema inicial (guardado en `localStorage` después de la primera visita)
4. Parámetros de URL (`?lang=en&theme=light`) sobrescriben las preferencias almacenadas
5. Todas las variables con prefijo `VITE_` se exponen al cliente en el build vía Vite
