import 'dotenv/config'

import { pool } from './database'

async function checkDatabase(): Promise<void> {
  const host = process.env.DB_HOST ?? 'localhost'
  const port = Number(process.env.DB_PORT) || 5432
  const database = process.env.DB_NAME ?? '(undefined)'
  const user = process.env.DB_USER ?? '(undefined)'

  console.log(`Verificando conexao com PostgreSQL em ${host}:${port}...`)

  await pool.query('SELECT 1')

  const infoResult = await pool.query<{
    current_database: string
    current_user: string
  }>('SELECT current_database(), current_user')

  const tableResult = await pool.query<{ exists: string | null }>(
    "SELECT to_regclass('public.usuario') AS exists"
  )

  const usuarioTableExists = tableResult.rows[0]?.exists === 'usuario'

  console.log('Conexao OK!')
  console.log(
    `Banco: ${infoResult.rows[0]?.current_database ?? database} | Usuario: ${infoResult.rows[0]?.current_user ?? user}`
  )
  console.log(
    `Tabela usuario: ${usuarioTableExists ? 'encontrada' : 'nao encontrada'}`
  )

  if (!usuarioTableExists) {
    throw new Error('Tabela usuario nao encontrada. Rode: npm run db:migrate')
  }
}

checkDatabase()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (error: unknown) => {
    console.error('Falha no check do banco:', error)
    await pool.end()
    process.exit(1)
  })
