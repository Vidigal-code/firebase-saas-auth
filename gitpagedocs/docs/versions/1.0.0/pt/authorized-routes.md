# Regras Firestore e Segurança

## Arquitetura Multi-Tenant

Os dados de cada usuário são completamente isolados. As regras de segurança do Firestore garantem que:

- Usuários só podem acessar **suas próprias** conexões
- Operações de contato e mensagem exigem propriedade da conexão pai
- Todas as operações de escrita validam campos obrigatórios

## Modelo de Dados Firestore

```
users/{userId}/
├── connections/{connectionId}
│   ├── name: string
│   ├── status: "active" | "inactive"
│   ├── createdAt: timestamp
│   ├── contacts/{contactId}
│   │   ├── name: string
│   │   ├── phone: string
│   │   └── createdAt: timestamp
│   └── messages/{messageId}
│       ├── content: string
│       ├── status: "sent" | "scheduled"
│       ├── scheduledAt?: timestamp
│       └── createdAt: timestamp
```

## Proteção de Rotas

### Guardas no Frontend

| Guarda | Comportamento |
|---|---|
| `PrivateRoute` | Redireciona para `/login` se não autenticado |
| `GuestRoute` | Redireciona para `/connections` se já autenticado |

### Rotas Protegidas

| Rota | Guarda | Acesso |
|---|---|---|
| `/` | `GuestRoute` | Somente público |
| `/login` | `GuestRoute` | Somente público |
| `/register` | `GuestRoute` | Somente público |
| `/connections` | `PrivateRoute` | Somente autenticado |
| `/connections/:id/contacts` | `PrivateRoute` | Somente autenticado |
| `/connections/:id/messages` | `PrivateRoute` | Somente autenticado |
| `*` (404) | Nenhum | Todos |

## Cloud Functions

As Cloud Functions do Firebase lidam com operações no servidor:

- **Agendamento de mensagens** com triggers do Firestore
- **Operações em lote** para envio em massa
- Validação e sanitização de dados na camada backend
