# Biblioteca CLI

Aplicacao de linha de comando para gestao de biblioteca, escrita em Node.js + TypeScript com PostgreSQL.

Este projeto foi desenvolvido como projeto final avaliativo do Curso: SCTEC - Desenvolvedor Back-End Node.
Turma: QA DBEN 2026/1 1.
Aluna: Karina Aparecida de Souza.

## Funcionalidades

- Cadastro e consulta de autores
- Cadastro e consulta de livros
- Cadastro e consulta de clientes
- Registro de emprestimos e devolucoes
- Relatorios operacionais (livros disponiveis, emprestados, ranking e clientes com emprestimos ativos)
- Cadastro de usuario de sistema para acesso ao menu CLI

## Pre-requisitos

- Node.js 18+
- npm 9+
- PostgreSQL rodando localmente (padrao: localhost:5432)

## Configuracao inicial

1. Instale dependencias:

```bash
npm install
```

2. Crie seu arquivo de ambiente:

```bash
cp .env.example .env
```

3. Ajuste os valores no arquivo .env:

```env
DEBUG=true
DB_USER=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sctec
DB_PASSWORD=password123
```

## Scripts disponiveis

- `npm run dev`: inicia em modo desenvolvimento com watch
- `npm run build`: compila TypeScript para `dist/`
- `npm run start`: executa a versao compilada
- `npm run db:migrate`: aplica schema SQL
- `npm run db:seed`: limpa e popula o banco com dados de demonstracao
- `npm run db:check`: valida conexao com banco e existencia da tabela `usuario`
- `npm run db:create-test-user`: cria usuario de teste sem interacao
- `npm run lint`: executa regras de lint

## Banco de dados

Aplicar schema:

```bash
npm run db:migrate
```

Popular banco com dados de demonstracao para apresentacao:

```bash
npm run db:seed
```

Observacao: o seed limpa os dados atuais das tabelas de dominio e recria um conjunto padrao de dados.

Validar conexao e tabela obrigatoria (usuario):

```bash
npm run db:check
```

Criar usuario de teste sem interacao (opcional):

```bash
npm run db:create-test-user
```

## Rodando a aplicacao

Modo desenvolvimento (watch):

```bash
npm run dev
```

Build de producao:

```bash
npm run build
```

Executar build:

```bash
npm run start
```

Ao iniciar, o menu principal permite navegar entre os modulos de Autores, Livros, Clientes, Emprestimos, Relatorios e Cadastro de Usuario.

## Qualidade de codigo

Executar lint:

```bash
npm run lint
```

## Fluxo rapido recomendado

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:check
npm run dev
```

## Estrutura principal

- src/main.ts: bootstrap da aplicacao
- src/database/: conexao, migracao e healthcheck
- src/controllers/: fluxo CLI
- src/services/: regras de negocio
- src/repositories/: acesso ao PostgreSQL
- src/models/: contratos de dominio
- src/utils/: utilitarios compartilhados

## Troubleshooting rapido

- Erro `ECONNREFUSED`:
  - Verifique se o PostgreSQL esta rodando em `DB_HOST:DB_PORT`
  - Execute `npm run db:check`

- Erro de role inexistente (exemplo: `role "admin" does not exist`):
  - Ajuste `DB_USER`/`DB_PASSWORD` no `.env` para um usuario valido do PostgreSQL

- Erro de tabela inexistente (exemplo: `relation "usuario" does not exist`):
  - Execute `npm run db:migrate`

## Arquivos locais que nao devem ser versionados

- `.env`
- `.idea/`
- `dist/`
- `node_modules/`

Esses caminhos ja estao no `.gitignore`.
