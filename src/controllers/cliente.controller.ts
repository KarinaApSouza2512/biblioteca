import { CreateClienteDto } from './dto/create-cliente-form.dto'
import { ClienteService } from '../services/cliente.service'
import { ConsoleView } from '../utils/console.view'

export class ClienteController extends ConsoleView {
  constructor(private readonly clienteService: ClienteService) {
    super(false)
  }

  protected async update(): Promise<void> {
    this.display('---- Gerenciar Clientes ----')
    this.display('1 - Cadastrar cliente')
    this.display('2 - Listar clientes')
    this.display('3 - Atualizar cliente')
    this.display('4 - Excluir cliente')
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
      'Informe os dados do cliente',
      CreateClienteDto.schema(),
      CreateClienteDto
    )

    const clienteOrError = await this.clienteService
      .create(dto)
      .catch((error: unknown) => error as Error)

    if (clienteOrError instanceof Error) {
      this.reportError(clienteOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Cliente "${clienteOrError.nome}" cadastrado com sucesso! (ID: ${String(clienteOrError.id)})`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleList(): Promise<void> {
    const clientes = await this.clienteService
      .findAll()
      .catch((error: unknown) => error as Error)

    if (clientes instanceof Error) {
      this.reportError(clientes)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (clientes.length === 0) {
      this.display('Nenhum cliente cadastrado.')
    } else {
      this.display(`Total de clientes cadastrados: ${String(clientes.length)}`)
      this.display('Observação: IDs podem ter lacunas após exclusões.')

      for (const cliente of clientes) {
        this.display(
          `#${String(cliente.id)} - ${cliente.nome} | CPF: ${cliente.cpf} | E-mail: ${cliente.email ?? '-'} | Telefone: ${cliente.telefone ?? '-'}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleUpdate(): Promise<void> {
    const id = await this.promptId('Informe o ID do cliente a atualizar: ')
    if (id === null) return

    const existing = await this.clienteService
      .findById(id)
      .catch((error: unknown) => error as Error)

    if (existing instanceof Error) {
      this.reportError(existing)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (!existing) {
      this.display('Cliente não encontrado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    const dto = await this.promptInteractiveForm(
      `Atualize os dados do cliente #${String(existing.id)}`,
      CreateClienteDto.schema(),
      CreateClienteDto
    )

    const updatedOrError = await this.clienteService
      .update(id, dto)
      .catch((error: unknown) => error as Error)

    if (updatedOrError instanceof Error) {
      this.reportError(updatedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      `Cliente #${String(updatedOrError.id)} atualizado com sucesso!`
    )
    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleDelete(): Promise<void> {
    const id = await this.promptId('Informe o ID do cliente a excluir: ')
    if (id === null) return

    const deletedOrError = await this.clienteService
      .delete(id)
      .catch((error: unknown) => error as Error)

    if (deletedOrError instanceof Error) {
      this.reportError(deletedOrError)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display(
      deletedOrError
        ? 'Cliente excluído com sucesso!'
        : 'Cliente não encontrado.'
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
