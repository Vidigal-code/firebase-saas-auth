# Variáveis de Ambiente

## Arquivo de Configuração

Copie `envexample.txt` para `.env` no diretório `web/`.

## Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Chave da API Firebase | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação | `projeto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto | `meu-projeto-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento | `projeto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID do sender | `123456789` |
| `VITE_FIREBASE_APP_ID` | ID do app | `1:123:web:abc` |
| `VITE_START_LANG` | Idioma padrão | `pt`, `en` ou `es` |
| `VITE_START_THEME` | Tema padrão | `dark` ou `light` |

## Como Funciona

1. As credenciais Firebase conectam o app ao seu projeto Firebase
2. `VITE_START_LANG` define o idioma inicial (salvo em `localStorage` após a primeira visita)
3. `VITE_START_THEME` define o tema inicial (salvo em `localStorage` após a primeira visita)
4. Parâmetros de URL (`?lang=en&theme=light`) sobrescrevem as preferências armazenadas
5. Todas as variáveis com prefixo `VITE_` são expostas ao cliente no build via Vite
