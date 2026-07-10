import { CreateAuthorDto } from './dto/create-author-form.dto'
import { AuthorService } from '../services/author.service'
import { ConsoleView } from '../utils/console.view'

export class AuthorController extends ConsoleView {
  constructor(private readonly authorService: AuthorService) {
    super(false)
  }

  protected async update(): Promise<void> {
    this.display('---- Gerenciar Autores ----')
    this.display('1 - Cadastrar autor')
    this.display('2 - Listar autores')
    this.display('3 - Atualizar autor')
    this.display('4 - Excluir autor')
    this.display('0 - Voltar')
    this.display('')

    const option = await this.prompt('Escolha uma opção: ')

    switch (option) {
      case '1': {
        await this.handleCreate()
        return
      }
      case '2': {
        await this.handleList()
        return
      }
      case '3': {
        await this.handleUpdate()
        return
      }
      case '4': {
        await this.handleDelete()
        return
      }
      case '0':
        this.exit()
        return
      default:
        this.display('Opção inválida!')
    }
  }

  private async handleCreate(): Promise<void> {
    const dto = await this.promptInteractiveForm(
      'Informe os dados do autor',
      CreateAuthorDto.schema(),
      CreateAuthorDto
    )

    const authorOrError = await this.authorService
      .create(dto)
      .catch((error: unknown) => error as Error)

    if (authorOrError instanceof Error) {
      this.reportTechnicalError(authorOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Autor "${authorOrError.nome}" cadastrado com sucesso! (ID: ${String(authorOrError.id)})`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleList(): Promise<void> {
    const authors = await this.authorService
      .findAll()
      .catch((error: unknown) => error as Error)

    if (authors instanceof Error) {
      this.reportTechnicalError(authors)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (authors.length === 0) {
      this.display('Nenhum autor cadastrado.')
    } else {
      for (const author of authors) {
        this.display(
          `#${String(author.id)} - ${author.nome} | Nacionalidade: ${author.nacionalidade ?? '-'} | Nascimento: ${author.data_nascimento ?? '-'}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleUpdate(): Promise<void> {
    const id = await this.promptId('Informe o ID do autor a atualizar: ')
    if (id === null) return

    const existing = await this.authorService
      .findById(id)
      .catch((error: unknown) => error as Error)

    if (existing instanceof Error) {
      this.reportTechnicalError(existing)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (!existing) {
      this.display('Autor não encontrado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const dto = await this.promptInteractiveForm(
      `Atualize os dados do autor #${String(existing.id)}`,
      CreateAuthorDto.schema(),
      CreateAuthorDto
    )

    const updatedOrError = await this.authorService
      .update(id, dto)
      .catch((error: unknown) => error as Error)

    if (updatedOrError instanceof Error) {
      this.reportTechnicalError(updatedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(`Autor #${String(updatedOrError.id)} atualizado com sucesso!`)
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleDelete(): Promise<void> {
    const id = await this.promptId('Informe o ID do autor a excluir: ')
    if (id === null) return

    const deletedOrError = await this.authorService
      .delete(id)
      .catch((error: unknown) => error as Error)

    if (deletedOrError instanceof Error) {
      this.reportTechnicalError(deletedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      deletedOrError ? 'Autor excluído com sucesso!' : 'Autor não encontrado.'
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async promptId(message: string): Promise<number | null> {
    const idInput = await this.prompt(message)
    const id = Number(idInput)

    if (Number.isNaN(id)) {
      this.display('ID inválido!')
      await this.prompt('Pressione ENTER para continuar...')
      return null
    }

    return id
  }
}
