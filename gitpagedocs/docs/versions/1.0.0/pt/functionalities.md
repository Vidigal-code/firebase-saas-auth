# Funcionalidades

## Autenticação

- **Login** com email e senha via Firebase Auth
- **Cadastro** com validação de senha forte (mín. 8 caracteres, maiúscula, minúscula, número, especial)
- **Alteração de senha** via dialog no dashboard
- **Guardas de rota**: `PrivateRoute` bloqueia acesso não autenticado, `GuestRoute` redireciona usuários logados para fora das páginas públicas

## Gestão de Conexões

- **Criar** conexões nomeadas (espaços de trabalho isolados)
- **Editar** nome da conexão
- **Excluir** com dialog de confirmação
- Cada conexão é um silo multi-tenant — usuários veem apenas seus próprios dados

## Gestão de Contatos

- **Adicionar contatos** com nome e telefone por conexão
- **Editar** e **excluir** contatos
- Listagem paginada com listeners em tempo real do Firestore

## Mensagens e Disparos

- **Enviar mensagens** para múltiplos contatos simultaneamente
- **Agendar mensagens** para envio futuro
- **Abas**: Todas, Enviadas, Agendadas
- Rastreamento de status em tempo real por mensagem

## Internacionalização (i18n)

- **3 idiomas**: Português (PT), Inglês (EN), Espanhol (ES)
- Sistema de tradução baseado em JSON em `src/shared/langs/`
- `LangProvider` com sincronização por parâmetro de URL (`?lang=pt`)
- Persistência em `localStorage` com fallback para `VITE_START_LANG`
- Componente `LangSelector` para troca em tempo de execução

## Temas

- Suporte a modo **Escuro** e **Claro**
- Componente `ThemeToggleButton`
- Persistência via `localStorage` com fallback para `VITE_START_THEME`
- Sincronização por parâmetro de URL (`?theme=dark`)

## Segurança

- **Firestore Rules** impõem isolamento multi-tenant via validação de `clientId`
- Cada usuário só pode ler/escrever suas próprias conexões, contatos e mensagens
- Política de senha forte aplicada no cadastro

## Componentes Reutilizáveis

| Componente | Finalidade |
|---|---|
| `LangSelector` | Dropdown de seleção de idioma |
| `ThemeToggleButton` | Toggle modo escuro/claro |
| `LangThemeBar` | Layout grid combinado lang + tema |
| `ActionButtonGroup` | Grid de botões configurável |
| `ConfirmDialog` | Confirmação de exclusão reutilizável |
| `PageHeader` | Cabeçalho padronizado com ícone e subtítulo |
| `BrandLogo` | Logo do app com tamanhos configuráveis |
