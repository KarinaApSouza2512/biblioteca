import 'dotenv/config'
import { AutorController } from './controllers/autor.controller'
import { ClienteController } from './controllers/cliente.controller'
import { EmprestimoController } from './controllers/emprestimo.controller'
import { LivroController } from './controllers/livro.controller'
import { MainController } from './controllers/main.controller'
import { RelatorioController } from './controllers/relatorio.controller'
import { initDatabase, pool } from './database/database'
import { AutorRepository } from './repositories/autor.repository'
import { ClienteRepository } from './repositories/cliente.repository'
import { EmprestimoRepository } from './repositories/emprestimo.repository'
import { LivroRepository } from './repositories/livro.repository'
import { RelatorioRepository } from './repositories/relatorio.repository'
import { UserRepository } from './repositories/user.repository'
import { AutorService } from './services/autor.service'
import { ClienteService } from './services/cliente.service'
import { CreateUserService } from './services/create-user.service'
import { EmprestimoService } from './services/emprestimo.service'
import { LivroService } from './services/livro.service'
import { RelatorioService } from './services/relatorio.service'

async function bootstrap() {
  await initDatabase()

  const autorRepository = new AutorRepository(pool)
  const clienteRepository = new ClienteRepository(pool)
  const livroRepository = new LivroRepository(pool)

  const createUserService = new CreateUserService(new UserRepository(pool))
  const autorService = new AutorService(autorRepository)
  const clienteService = new ClienteService(clienteRepository)
  const livroService = new LivroService(livroRepository, autorRepository)
  const emprestimoService = new EmprestimoService(
    new EmprestimoRepository(pool),
    livroRepository,
    clienteRepository
  )
  const relatorioService = new RelatorioService(new RelatorioRepository(pool))

  const autorController = new AutorController(autorService)
  const clienteController = new ClienteController(clienteService)
  const livroController = new LivroController(livroService)
  const emprestimoController = new EmprestimoController(emprestimoService)
  const relatorioController = new RelatorioController(relatorioService)

  const mainController = new MainController(
    createUserService,
    autorController,
    livroController,
    clienteController,
    emprestimoController,
    relatorioController
  )

  await mainController.start()
}

void bootstrap().catch((error: unknown) => {
  console.error('Falha ao iniciar a aplicação:', error)
  process.exit(1)
})
