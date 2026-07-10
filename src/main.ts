import 'dotenv/config'
import { AuthorController } from './controllers/author.controller'
import { MainController } from './controllers/main.controller'
import { initDatabase, pool } from './database/database'
import { AuthorRepository } from './repositories/author.repository'
import { UserRepository } from './repositories/user.repository'
import { AuthorService } from './services/author.service'
import { CreateUserService } from './services/create-user.service'

async function bootstrap() {
  await initDatabase()

  const createUserService = new CreateUserService(new UserRepository(pool))
  const authorService = new AuthorService(new AuthorRepository(pool))
  const authorController = new AuthorController(authorService)
  const mainController = new MainController(createUserService, authorController)

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
