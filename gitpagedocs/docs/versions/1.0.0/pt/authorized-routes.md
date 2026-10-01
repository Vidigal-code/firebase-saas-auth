# Regras do Firestore e segurança

## Modelo de dados (sem subcoleções)

| Coleção | Campos |
|---|---|
| `users/{uid}` | `email`, `createdAt` |
| `connections/{id}` | `clientId`, `name`, `createdAt`, `updatedAt` |
| `contacts/{id}` | `clientId`, `connectionId`, `name`, `phone`, `createdAt`, `updatedAt` |
| `messages/{id}` | `clientId`, `connectionId`, `contactIds[]`, `content`, `status`, `scheduledAt`, `sentAt`, `createdAt`, `updatedAt` |

Todo documento carrega o `clientId` (o `uid` do dono). Contatos e mensagens também carregam o `connectionId`, então as consultas filtram por `clientId` + `connectionId` sem precisar de subcoleções.

## Estratégia de isolamento

1. **Leitura**: só é permitida se `resource.data.clientId == request.auth.uid`. Consultas sem o filtro `where('clientId', '==', uid)` são recusadas.
2. **Criação**: o `clientId` enviado precisa ser o do usuário autenticado, e o `connectionId` precisa apontar para uma conexão **do próprio cliente** (verificado com `get()`).
3. **Atualização**: `clientId` e `connectionId` são imutáveis (`diff().affectedKeys()`), o que impede transferir dados para outro cliente.
4. **Validação de esquema**: campos exatos (`hasOnly`), textos não vazios com limite de tamanho, telefone por regex, de 1 a 200 destinatários.
5. **Datas do servidor**: `createdAt`, `updatedAt` e `sentAt` precisam ser `request.time`.
6. **Ciclo de vida da mensagem**:
   - criação como `sent` (com `sentAt = request.time`) ou como `scheduled` com `scheduledAt` no futuro;
   - uma mensagem agendada pode ser reagendada ou enviada agora;
   - uma mensagem enviada mantém status e datas de entrega;
   - só a Cloud Function (Admin SDK) faz a transição automática no horário.

## Testes

- `tests/firestore.rules.test.ts`: 25 cenários no emulador (outro cliente não lê, não edita, não exclui e não referencia dados alheios; esquema; ciclo de vida).
- `web/src/test/tenantFlow.integration.test.ts`: os repositórios reais do app contra os emuladores de Auth e Firestore, incluindo a negação de acesso entre clientes.

## Rotas do frontend

- `RequireAuth`: `/connections`, `/connections/:id/contacts`, `/connections/:id/broadcast`.
- `RequireGuest`: `/`, `/login`, `/register`.
- Acessar a conexão de outro cliente pela URL mostra "Conexão não encontrada": a leitura é negada pelas regras.
