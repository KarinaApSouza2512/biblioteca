import 'dotenv/config'
import { AutorController } from './controllers/autor.controller'
import { ClienteController } from './controllers/cliente.controller'
import { MainController } from './controllers/main.controller'
import { initDatabase, pool } from './database/database'
import { AutorRepository } from './repositories/autor.repository'
import { ClienteRepository } from './repositories/cliente.repository'
import { UserRepository } from './repositories/user.repository'
import { AutorService } from './services/autor.service'
import { ClienteService } from './services/cliente.service'
import { CreateUserService } from './services/create-user.service'

async function bootstrap() {
  await initDatabase()

  const createUserService = new CreateUserService(new UserRepository(pool))
  const autorService = new AutorService(new AutorRepository(pool))
  const clienteService = new ClienteService(new ClienteRepository(pool))

  const autorController = new AutorController(autorService)
  const clienteController = new ClienteController(clienteService)

  const mainController = new MainController(
    createUserService,
    autorController,
    clienteController
  )

  await mainController.start()
}

bootstrap()
  .then(() => {
    process.exit(0)
  })
  .catch((e: unknown) => {
    console.log('UNHANDLED REJECTION')
    console.error(e)
    process.exit(1)
  })
