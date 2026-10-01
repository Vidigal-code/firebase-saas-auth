# Funcionalidades

## Autenticação

- Cadastro e login com e-mail e senha (Firebase Authentication).
- Política de senha: mínimo de 8 caracteres com maiúscula, minúscula, número e símbolo.
- Troca de senha com reautenticação.
- Cada usuário cadastrado é um **cliente**; o `uid` dele é o `clientId` de todos os seus dados.
- Rotas protegidas por `RequireAuth` e `RequireGuest`.

## Conexões

- Criar, listar (tempo real), renomear e excluir.
- Ao excluir uma conexão, a Cloud Function `cleanupDeletedConnection` remove os contatos e as mensagens dela.

## Contatos

- Nome e telefone por conexão; o telefone é normalizado (ex.: `+55 (11) 99999-8888` → `+5511999998888`) e validado.
- Ao excluir um contato, a Cloud Function `detachDeletedContact` o remove dos destinatários das mensagens.

## Broadcast

- Seleção de um ou vários contatos (busca e "selecionar todos").
- **Enviar agora**: a mensagem é gravada como `sent` com o horário do servidor (simulação do envio).
- **Agendar**: a mensagem fica `scheduled` até o horário escolhido, que precisa estar no futuro.
- **Disparo automático**: a Cloud Function `dispatchScheduledMessages` roda a cada minuto e muda para `sent` toda mensagem cujo horário chegou, mesmo com o app fechado. A atualização aparece na tela em tempo real. Implementada e testada, mas **inativa no app publicado** (flag `VITE_SCHEDULED_DISPATCH_ENABLED=false`): publicar Cloud Functions exige o plano Blaze do Firebase. Enquanto a flag está desligada, o app avisa que o disparo automático está inativo e as mensagens agendadas podem ser enviadas por "Editar → Enviar agora".
- Filtros **Todas / Enviadas / Agendadas** com contadores.
- Edição: mensagens agendadas podem mudar texto, contatos e horário (ou ser enviadas agora); mensagens enviadas só mudam texto e contatos.
- Exclusão com confirmação.

## Experiência

- Interface em Português, Inglês e Espanhol (`?lang=en` também funciona).
- Tema claro e escuro.
- 100% responsivo: abaixo de 900px o topo vira um menu hambúrguer (navegação, conta, idioma e tema); abaixo de 600px o conteúdo fica centralizado, um item embaixo do outro, e os dialogs ocupam a tela inteira.
- Feedback com notificações e estados de carregamento, erro e vazio.
