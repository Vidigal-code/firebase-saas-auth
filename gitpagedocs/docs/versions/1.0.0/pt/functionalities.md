# Funcionalidades

SaaS de broadcast multiusuário. Cada conta gerencia conexões, contatos e mensagens próprias. O envio é uma simulação: marcar uma mensagem como sent não entrega WhatsApp, SMS ou e-mail. A documentação descreve o código local; o estado de faturamento e as funções efetivamente publicadas devem ser conferidos no Firebase.

## Fluxo e casos de falha

1. Cadastro/login → Firebase Auth → SessionProvider → guard de rota → consultas filtradas pelo uid. A criação do perfil usa users/{uid}; conexões, contatos e mensagens são coleções planas com clientId. Listas usam onSnapshot e atualizam a interface em tempo real.

2. Conexão → contato com telefone normalizado → seleção dos destinatários → composição. Enviar agora grava status sent, sentAt do servidor e scheduledAt nulo. Agendar grava scheduled e data futura; é possível reagendar ou enviar uma mensagem agendada manualmente. Uma mensagem já enviada mantém seus campos de entrega.

3. dispatchScheduledMessages executa a cada minuto, consulta mensagens vencidas por status/data e processa páginas com BulkWriter. A precondição lastUpdateTime evita sobrescrever uma edição concorrente; a próxima execução reavalia o documento. Não há integração externa de entrega nem garantia de disparo no segundo exato.

4. Excluir conexão dispara cleanupDeletedConnection para remover contatos e mensagens relacionados; excluir contato dispara detachDeletedContact para removê-lo dos destinatários. Essas limpezas dependem das Functions implantadas. VITE_SCHEDULED_DISPATCH_ENABLED controla os avisos do web e a condição do workflow de deploy; mudar a flag sozinha não publica funções.

## Arquivos relacionados

- [firestore.rules](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firestore.rules)
- [firebase.json](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firebase.json)
- [firestore.indexes.json](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/firestore.indexes.json)
- [functions/src/index.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/functions/src/index.ts)
- [functions/src/messages/dispatchDueMessages.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/functions/src/messages/dispatchDueMessages.ts)
- [web/src/entities/message/api/messagesRepository.ts](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/web/src/entities/message/api/messagesRepository.ts)
- [.github/workflows/firebase-deploy.yml](https://github.com/Vidigal-code/firebase-saas-auth/blob/8fec8eb0c5e82a43f44f1ad60372a32b5f326434/.github/workflows/firebase-deploy.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=8)
- [Source reference](?menu=pt&lang=pt&id=9)
