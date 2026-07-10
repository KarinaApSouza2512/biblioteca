import { CreateUserDto } from './dto/create-user-form.dto'
import { CreateUserService } from '../services/create-user.service'
import { ConsoleView } from '../utils/console.view'

export class MainController extends ConsoleView {
  constructor(private readonly createUserService: CreateUserService) {
    super(true)
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('   Bem-vindo ao Acervo CLI              ')
    this.display('   Sistema de Gestão de Biblioteca      ')
    this.display('========================================')
    this.display('')

    const createUserDto = await this.promptInteractiveForm(
      `Informe os dados do usuário`,
      CreateUserDto.schema(),
      CreateUserDto
    )

    const userOrError = await this.createUserService
      .execute(createUserDto)
      .catch((error: unknown) => error as Error)

    if (userOrError instanceof Error) {
      this.reportTechnicalError(userOrError)
      await this.prompt('Pressione ENTER para sair...')
      return
    }

    await this.prompt(
      `Usuario ${JSON.stringify(userOrError)} criado com sucesso!`
    )
    await this.prompt('Pressione ENTER para sair...')
    this.exit()
  }
}
