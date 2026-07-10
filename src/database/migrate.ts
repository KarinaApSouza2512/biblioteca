import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import 'dotenv/config'

import { pool } from './database'

async function migrate(): Promise<void> {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')

  console.log('Aplicando schema.sql...')
  await pool.query(schema)
  console.log('Schema aplicado com sucesso!')
}

migrate()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch(async (error: unknown) => {
    console.error('Falha ao aplicar o schema:', error)
    await pool.end()
    process.exit(1)
  })
