import { Pool } from 'pg'

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
  min: 2
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function initDatabase(): Promise<void> {
  console.log('Iniciando banco de dados...')

  try {
    await pool.query('SELECT 1')
  } catch (error) {
    console.error('Falha ao conectar ao banco de dados:', error)
    throw error
  }

  console.log('Banco de dados iniciado com sucesso!')
}
