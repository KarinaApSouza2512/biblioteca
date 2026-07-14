import { CreateLivroDto } from './dto/create-livro-form.dto'
import { LivroService } from '../services/livro.service'
import { ConsoleView } from '../utils/console.view'

export class LivroController extends ConsoleView {
  constructor(private readonly livroService: LivroService) {
    super(false)
  }

  protected async update(): Promise<void> {
    this.display('---- Gerenciar Livros ----')
    this.display('1 - Cadastrar livro')
    this.display('2 - Listar livros')
    this.display('3 - Atualizar livro')
    this.display('4 - Excluir livro')
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
      'Informe os dados do livro',
      CreateLivroDto.schema(),
      CreateLivroDto
    )

    const livroOrError = await this.livroService
      .create(dto)
      .catch((error: unknown) => error as Error)

    if (livroOrError instanceof Error) {
      this.reportError(livroOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Livro "${livroOrError.titulo}" cadastrado com sucesso! (ID: ${String(livroOrError.id)})`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleList(): Promise<void> {
    const livros = await this.livroService
      .findAll()
      .catch((error: unknown) => error as Error)

    if (livros instanceof Error) {
      this.reportError(livros)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (livros.length === 0) {
      this.display('Nenhum livro cadastrado.')
    } else {
      for (const livro of livros) {
        this.display(
          `#${String(livro.id)} - ${livro.titulo} | Autor: #${String(livro.autor_id)} | ISBN: ${livro.isbn ?? '-'} | Ano: ${livro.ano_publicacao ? String(livro.ano_publicacao) : '-'} | Gênero: ${livro.genero ?? '-'} | Estoque: ${String(livro.quantidade_estoque)}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleUpdate(): Promise<void> {
    const id = await this.promptId('Informe o ID do livro a atualizar: ')
    if (id === null) return

    const existing = await this.livroService
      .findById(id)
      .catch((error: unknown) => error as Error)

    if (existing instanceof Error) {
      this.reportError(existing)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (!existing) {
      this.display('Livro não encontrado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const dto = await this.promptInteractiveForm(
      `Atualize os dados do livro #${String(existing.id)}`,
      CreateLivroDto.schema(),
      CreateLivroDto
    )

    const updatedOrError = await this.livroService
      .update(id, dto)
      .catch((error: unknown) => error as Error)

    if (updatedOrError instanceof Error) {
      this.reportError(updatedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(`Livro #${String(updatedOrError.id)} atualizado com sucesso!`)
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleDelete(): Promise<void> {
    const id = await this.promptId('Informe o ID do livro a excluir: ')
    if (id === null) return

    const deletedOrError = await this.livroService
      .delete(id)
      .catch((error: unknown) => error as Error)

    if (deletedOrError instanceof Error) {
      this.reportError(deletedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      deletedOrError ? 'Livro excluído com sucesso!' : 'Livro não encontrado.'
    )
    await this.prompt('Pressione ENTER para continuar...')
  }
}
