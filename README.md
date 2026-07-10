# Biblioteca CLI

Aplicacao de linha de comando para cadastro de usuarios e operacoes de biblioteca,
escrita em Node.js + TypeScript com PostgreSQL.

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

## Banco de dados

Aplicar schema:

```bash
npm run db:migrate
```

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
