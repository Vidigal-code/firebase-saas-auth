# Visão geral do projeto

## Estrutura do repositório

```
firebase-saas-auth/
├── functions/              # Cloud Functions (agendamento e limpeza em cascata)
├── web/                    # Frontend React + Vite
├── tests/                  # Testes das regras do Firestore (emulador)
├── scripts/                # Utilitários (execução de testes com emuladores)
├── firestore.rules         # Isolamento multi-tenant e validação de dados
├── firestore.indexes.json  # Índices compostos das consultas
├── firebase.json           # Hosting, Functions, Firestore e emuladores
└── .github/workflows/      # CI/CD (testes + deploy automático)
```

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19, Material UI 9 (componentes), Tailwind CSS 4 (estilização) |
| Build | Vite 8 |
| Roteamento | React Router 7 |
| Formulários | React Hook Form + Zod |
| Backend | Firebase Authentication, Cloud Firestore, Cloud Functions v2 (Node 22) |
| Testes | Vitest, Testing Library, `@firebase/rules-unit-testing`, emuladores Firebase |
| Qualidade | ESLint (typescript-eslint strict), SonarQube |

## Princípios

- **Paradigma funcional**: nenhuma classe; componentes, hooks e funções puras.
- **Fonte única de verdade**: nomes de coleções, limites de validação, rotas e tokens de tema ficam em constantes; cores são definidas uma vez no tema do MUI e expostas ao Tailwind por variáveis CSS.
- **Segurança no servidor**: o isolamento entre clientes é garantido pelas regras do Firestore, não apenas pela interface.
- **Tempo real**: listas sincronizadas com `onSnapshot`.
- **TDD**: regras, Functions e domínio do frontend cobertos por testes automatizados.
