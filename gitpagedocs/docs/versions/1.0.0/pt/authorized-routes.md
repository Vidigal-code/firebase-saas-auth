# Regras Firestore e segurança

SaaS de broadcast multiusuário. Cada conta gerencia conexões, contatos e mensagens próprias. O envio é uma simulação: marcar uma mensagem como sent não entrega WhatsApp, SMS ou e-mail. A documentação descreve o código local; o estado de faturamento e as funções efetivamente publicadas devem ser conferidos no Firebase.

## Contratos de dados

firestore.rules exige proprietário autenticado, timestamps do servidor, esquema permitido e vínculo da conexão ao mesmo cliente. Nomes têm limite 80; conteúdo 1000; destinatários entre 1 e 200; telefone segue o padrão definido nas regras. A lista de IDs de contatos não é validada individualmente pelas regras: não atribua a elas uma garantia adicional de integridade referencial. Guards de interface não substituem as regras. A configuração pública Firebase não é credencial administrativa; secrets de conta de serviço ficam fora do frontend.

## Fluxo e casos de falha

Cadastro/login → Firebase Auth → SessionProvider → guard de rota → consultas filtradas pelo uid. A criação do perfil usa users/{uid}; conexões, contatos e mensagens são coleções planas com clientId. Listas usam onSnapshot e atualizam a interface em tempo real.

Use Node 22 e Java 21+ para os emuladores. Execute install:all, copie web/.env.example, execute npm run build para gerar functions/lib e web/dist, e então inicie emulators e web dev:emulators. O projeto demo-broadcast evita atingir dados reais. Rode lint, typecheck, test e build na raiz. Para permission-denied confira clientId e a conexão; para consultas com índice ausente confira firestore.indexes.json; para agendamentos parados confira implantação, logs e flag. Cloud Functions em produção dependem de faturamento habilitado; consulte a documentação Firebase antes de ativar custos. O workflow firebase-deploy é separado do GitPageDocs.

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
