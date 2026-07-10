import 'dotenv/config'
import { MainController } from './controllers/main.controller'
import { initDatabase, pool } from './database/database'
import { UserRepository } from './repositories/user.repository'
import { CreateUserService } from './services/create-user.service'

async function bootstrap() {
  await initDatabase()

  const createUserService = new CreateUserService(new UserRepository(pool))
  const mainController = new MainController(createUserService)

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
