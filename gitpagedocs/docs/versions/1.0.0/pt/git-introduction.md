# Arquitetura

## Frontend: Feature-Sliced Design

```
web/src/
├── app/        # Providers (tema, i18n, sessão, notificações), rotas e estilos globais
├── pages/      # Telas: home, login, cadastro, conexões, contatos, broadcast, 404
├── widgets/    # Layouts: app shell (topo, menu da conta) e layout da conexão (abas)
├── features/   # Casos de uso: auth, editores de conexão/contato, compositor e filtro de mensagens
├── entities/   # Modelos, repositórios Firestore e hooks: session, connection, contact, message
└── shared/     # Firebase, i18n, tema, hooks e componentes genéricos
```

- **Repositórios** (`entities/*/api`) concentram o acesso ao Firestore: consultas tipadas com conversores e funções de escrita com payloads explícitos.
- **Tempo real**: `useRealtimeQuery` e `useRealtimeDocument` assinam consultas com `onSnapshot` e nunca exibem dados de uma consulta anterior.
- **Estado**: a sessão vem de `onAuthStateChanged` (contexto React); os dados vêm direto dos listeners do Firestore, sem cache global extra.
- **Estilo**: componentes do Material UI, estilização com classes Tailwind. As camadas CSS (`theme, base, mui, components, utilities`) fazem o Tailwind ter prioridade, e as cores do tema MUI viram utilitários Tailwind (`bg-background-paper`, `text-primary`...).

## Backend: Cloud Functions

```
functions/src/
├── index.ts                    # Registro das funções
├── messages/dispatchDueMessages.ts
├── cascade/deleteConnectionData.ts
├── cascade/detachContactFromMessages.ts
├── lib/                        # Paginação e escrita em lote (BulkWriter)
├── domain/                     # Coleções, campos e status
└── config/runtime.ts           # Região, agenda e tamanho de página
```

| Função | Gatilho | Responsabilidade |
|---|---|---|
| `dispatchScheduledMessages` | Agenda (a cada 1 min) | Muda `scheduled` → `sent` quando `scheduledAt <= agora` |
| `cleanupDeletedConnection` | `connections/{id}` excluído | Remove contatos e mensagens da conexão |
| `detachDeletedContact` | `contacts/{id}` excluído | Remove o contato de `contactIds` das mensagens |

O disparo usa uma pré-condição (`lastUpdateTime`): se o cliente editar a mensagem no mesmo instante, a escrita é descartada e a mensagem é reavaliada no minuto seguinte.
