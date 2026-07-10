import { AuthorController } from './author.controller'
import { CreateUserDto } from './dto/create-user-form.dto'
import { CreateUserService } from '../services/create-user.service'
import { ConsoleView } from '../utils/console.view'

export class MainController extends ConsoleView {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly authorController: AuthorController
  ) {
    super(true)
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('   Bem-vindo ao Acervo CLI              ')
    this.display('   Sistema de Gestão de Biblioteca      ')
    this.display('========================================')
    this.display('')
    this.display('1 - Gerenciar Autores')
    this.display('2 - Cadastrar novo usuário do sistema')
    this.display('0 - Sair')
    this.display('')

    const option = await this.prompt('Escolha uma opção: ')

    switch (option) {
      case '1': {
        await this.authorController.start()
        return
      }
      case '2': {
        await this.handleCreateUser()
        return
      }
      case '0':
        this.exit()
        return
      default:
        this.display('Opção inválida!')
    }
  }

  private async handleCreateUser(): Promise<void> {
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
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    await this.prompt(
      `Usuario ${JSON.stringify(userOrError)} criado com sucesso!`
    )
  }
}
