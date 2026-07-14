# Biblioteca CLI

Aplicacao de linha de comando para gestao de biblioteca, desenvolvida com Node.js, TypeScript e PostgreSQL.

> Projeto final avaliativo do curso SCTEC - Desenvolvedor Back-End Node.
>
> Turma: QA DBEN 2026/1 1  
> Aluna: Karina Aparecida de Souza

## Visao Geral

O sistema foi criado para demonstrar operacoes essenciais de uma biblioteca em ambiente de terminal, com foco em organizacao por camadas, persistencia em banco relacional e fluxo de uso simples para apresentacao.

### Funcionalidades

- Cadastro e consulta de autores
- Cadastro e consulta de livros
- Cadastro e consulta de clientes
- Registro de emprestimos e devolucoes
- Relatorios operacionais
- Cadastro de usuarios do sistema

### Relatorios disponiveis

- Livros disponiveis
- Livros emprestados atualmente
- Quantidade de livros por autor
- Quantidade de emprestimos por livro
- Clientes com emprestimos ativos

## Tecnologias

- Node.js
- TypeScript
- PostgreSQL
- pg
- dotenv
- ESLint

## Pre-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- PostgreSQL rodando localmente em `localhost:5432`

## Configuracao do ambiente

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Configure o `.env`:

```env
DEBUG=true
DB_USER=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sctec
DB_PASSWORD=password123
```

## Fluxo rapido para apresentar

Use esta sequencia para deixar o projeto pronto para demonstracao:

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Scripts disponiveis

| Comando                       | Descricao                                                     |
| ----------------------------- | ------------------------------------------------------------- |
| `npm run dev`                 | Inicia a aplicacao em modo desenvolvimento com watch          |
| `npm run build`               | Compila o projeto para `dist/`                                |
| `npm run start`               | Executa a versao compilada                                    |
| `npm run db:migrate`          | Aplica o schema SQL no banco                                  |
| `npm run db:seed`             | Limpa e popula o banco com dados de demonstracao              |
| `npm run db:check`            | Verifica conexao com o banco e existencia da tabela `usuario` |
| `npm run db:create-test-user` | Cria um usuario de teste sem interacao                        |
| `npm run lint`                | Executa as validacoes de lint                                 |

## Banco de dados

### Aplicar schema

```bash
npm run db:migrate
```

### Popular com dados de demonstracao

```bash
npm run db:seed
```

O seed recria os dados de dominio e deixa o sistema pronto para navegacao e relatarios.

### Verificar conexao

```bash
npm run db:check
```

### Criar usuario de teste adicional

```bash
npm run db:create-test-user
```

## Execucao da aplicacao

### Desenvolvimento

```bash
npm run dev
```

### Build de producao

```bash
npm run build
```

### Executar versao compilada

```bash
npm run start
```

Ao iniciar, o menu principal permite acessar os modulos de autores, livros, clientes, emprestimos, relatorios e usuarios.

## Estrutura do projeto

```text
src/
  controllers/   fluxos da CLI
  database/      conexao, migracao, seed e healthcheck
  models/        contratos e tipos de dominio
  repositories/  acesso ao PostgreSQL
  services/      regras de negocio
  utils/         utilitarios compartilhados
```

## Qualidade de codigo

```bash
npm run lint
```

## Troubleshooting

### Erro `ECONNREFUSED`

- Verifique se o PostgreSQL esta rodando em `DB_HOST:DB_PORT`
- Execute `npm run db:check`

### Erro de role inexistente

Exemplo: `role "admin" does not exist`

- Ajuste `DB_USER` e `DB_PASSWORD` no `.env`
- Verifique se a role existe no PostgreSQL local

### Erro de tabela inexistente

Exemplo: `relation "usuario" does not exist`

- Execute `npm run db:migrate`

## Arquivos locais nao versionados

- `.env`
- `.idea/`
- `dist/`
- `node_modules/`

Esses caminhos ja estao configurados no `.gitignore`.
