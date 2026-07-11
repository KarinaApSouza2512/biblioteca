import 'dotenv/config'

import { pool } from '../database/database'
import { UserRepository } from '../repositories/user.repository'
import { CreateUserService } from '../services/create-user.service'

async function run(): Promise<void> {
  const createUserService = new CreateUserService(new UserRepository(pool))

  const timestamp = Date.now()
  const timestampText = String(timestamp)
  const login = `usuario_teste_cli_${timestampText}`

  const user = await createUserService.execute({
    nome: 'Usuario Teste CLI',
    email: `${login}@example.com`,
    cpf: timestampText.slice(-11),
    login,
    senha: '123456'
  })

  console.log('Usuario criado com sucesso!')
  console.log(`id=${String(user.id)} login=${user.login} email=${user.email}`)
}

run()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (error: unknown) => {
    console.error('Falha ao criar usuario de teste:', error)
    await pool.end()
    process.exit(1)
  })
