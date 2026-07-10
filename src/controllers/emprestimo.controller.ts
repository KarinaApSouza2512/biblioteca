import { CreateEmprestimoDto } from './dto/create-emprestimo-form.dto'
import { EmprestimoService } from '../services/emprestimo.service'
import { ConsoleView } from '../utils/console.view'

export class EmprestimoController extends ConsoleView {
  constructor(private readonly emprestimoService: EmprestimoService) {
    super(false)
  }

  protected async update(): Promise<void> {
    this.display('---- Gerenciar Empréstimos ----')
    this.display('1 - Registrar empréstimo')
    this.display('2 - Listar empréstimos')
    this.display('3 - Registrar devolução')
    this.display('0 - Voltar')
    this.display('')

    const option = await this.prompt('Escolha uma opção: ')

    switch (option) {
      case '1': {
        await this.handleRegistrar()
        return
      }
      case '2': {
        await this.handleList()
        return
      }
      case '3': {
        await this.handleDevolucao()
        return
      }
      case '0':
        this.exit()
        return
      default:
        this.display('Opção inválida!')
    }
  }

  private async handleRegistrar(): Promise<void> {
    const dto = await this.promptInteractiveForm(
      'Informe os dados do empréstimo',
      CreateEmprestimoDto.schema(),
      CreateEmprestimoDto
    )

    const emprestimoOrError = await this.emprestimoService
      .registrar(dto)
      .catch((error: unknown) => error as Error)

    if (emprestimoOrError instanceof Error) {
      this.reportError(emprestimoOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Empréstimo #${String(emprestimoOrError.id)} registrado com sucesso!`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleList(): Promise<void> {
    const emprestimos = await this.emprestimoService
      .findAll()
      .catch((error: unknown) => error as Error)

    if (emprestimos instanceof Error) {
      this.reportError(emprestimos)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (emprestimos.length === 0) {
      this.display('Nenhum empréstimo registrado.')
    } else {
      for (const emprestimo of emprestimos) {
        this.display(
          `#${String(emprestimo.id)} - Livro #${String(emprestimo.livro_id)} | Cliente #${String(emprestimo.cliente_id)} | Status: ${emprestimo.status} | Devolução prevista: ${emprestimo.data_prevista_devolucao} | Devolvido em: ${emprestimo.data_devolucao ?? '-'}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleDevolucao(): Promise<void> {
    const idInput = await this.prompt('Informe o ID do empréstimo a devolver: ')
    const id = Number(idInput)

    if (Number.isNaN(id)) {
      this.display('ID inválido!')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const emprestimoOrError = await this.emprestimoService
      .registrarDevolucao(id)
      .catch((error: unknown) => error as Error)

    if (emprestimoOrError instanceof Error) {
      this.reportError(emprestimoOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Empréstimo #${String(emprestimoOrError.id)} devolvido com sucesso!`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }
}
