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
    this.display('Informe os dados do empréstimo (digite 0 para cancelar).')

    const livroId = await this.promptPositiveNumberOrCancel('livro_id: ')

    if (livroId === null) {
      this.display('Registro de empréstimo cancelado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const clienteId = await this.promptPositiveNumberOrCancel('cliente_id: ')

    if (clienteId === null) {
      this.display('Registro de empréstimo cancelado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const dataPrevista = await this.promptRequiredDateOrCancel(
      'data_prevista_devolucao (YYYY-MM-DD): '
    )

    if (dataPrevista === null) {
      this.display('Registro de empréstimo cancelado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const dto = new CreateEmprestimoDto(livroId, clienteId, dataPrevista)

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

  private async promptPositiveNumberOrCancel(
    message: string
  ): Promise<number | null> {
    for (;;) {
      const input = (await this.prompt(message)).trim()

      if (input === '0') {
        return null
      }

      const value = Number(input)

      if (Number.isNaN(value) || value <= 0 || !Number.isInteger(value)) {
        this.display(
          'Digite um número inteiro positivo válido ou 0 para voltar.'
        )
        continue
      }

      return value
    }
  }

  private async promptRequiredDateOrCancel(
    message: string
  ): Promise<string | null> {
    for (;;) {
      const input = (await this.prompt(message)).trim()

      if (input === '0') {
        return null
      }

      if (!input) {
        this.display('Campo obrigatório! Informe uma data ou 0 para voltar.')
        continue
      }

      return input
    }
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
    const id = await this.promptId('Informe o ID do empréstimo a devolver: ')

    if (id === null) {
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
