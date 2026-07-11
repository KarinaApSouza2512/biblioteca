import { RelatorioService } from '../services/relatorio.service'
import { ConsoleView } from '../utils/console.view'

export class RelatorioController extends ConsoleView {
  constructor(private readonly relatorioService: RelatorioService) {
    super(false)
  }

  protected async update(): Promise<void> {
    this.display('---- Relatórios ----')
    this.display('1 - Livros disponíveis')
    this.display('2 - Livros emprestados atualmente')
    this.display('3 - Quantidade de livros por autor')
    this.display('4 - Quantidade de empréstimos por livro')
    this.display('5 - Clientes com empréstimos ativos')
    this.display('0 - Voltar')
    this.display('')

    const option = await this.prompt('Escolha uma opção: ')

    switch (option) {
      case '1': {
        await this.handleLivrosDisponiveis()
        return
      }
      case '2': {
        await this.handleLivrosEmprestados()
        return
      }
      case '3': {
        await this.handleLivrosPorAutor()
        return
      }
      case '4': {
        await this.handleEmprestimosPorLivro()
        return
      }
      case '5': {
        await this.handleClientesComEmprestimosAtivos()
        return
      }
      case '0':
        this.exit()
        return
      default:
        this.display('Opção inválida!')
    }
  }

  private async handleLivrosDisponiveis(): Promise<void> {
    const livros = await this.relatorioService
      .livrosDisponiveis()
      .catch((error: unknown) => error as Error)

    if (livros instanceof Error) {
      this.reportError(livros)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display('--- Livros disponíveis ---')

    if (livros.length === 0) {
      this.display('Nenhum livro disponível no momento.')
    } else {
      for (const livro of livros) {
        this.display(
          `#${String(livro.id)} - ${livro.titulo} | Autor: ${livro.autor_nome} | Estoque: ${String(livro.quantidade_estoque)}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleLivrosEmprestados(): Promise<void> {
    const livros = await this.relatorioService
      .livrosEmprestados()
      .catch((error: unknown) => error as Error)

    if (livros instanceof Error) {
      this.reportError(livros)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display('--- Livros emprestados atualmente ---')

    if (livros.length === 0) {
      this.display('Nenhum livro emprestado no momento.')
    } else {
      for (const livro of livros) {
        this.display(
          `#${String(livro.livro_id)} - ${livro.titulo} (${livro.autor_nome}) | Cliente: ${livro.cliente_nome} | Emprestado em: ${livro.data_emprestimo} | Devolução prevista: ${livro.data_prevista_devolucao}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleLivrosPorAutor(): Promise<void> {
    const resultado = await this.relatorioService
      .livrosPorAutor()
      .catch((error: unknown) => error as Error)

    if (resultado instanceof Error) {
      this.reportError(resultado)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display('--- Quantidade de livros por autor ---')

    if (resultado.length === 0) {
      this.display('Nenhum autor cadastrado.')
    } else {
      for (const item of resultado) {
        this.display(
          `${item.autor_nome} | Livros cadastrados: ${String(item.quantidade_livros)} | Estoque total: ${String(item.estoque_total)}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleEmprestimosPorLivro(): Promise<void> {
    const resultado = await this.relatorioService
      .emprestimosPorLivro()
      .catch((error: unknown) => error as Error)

    if (resultado instanceof Error) {
      this.reportError(resultado)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display('--- Empréstimos por livro (top 10) ---')

    if (resultado.length === 0) {
      this.display('Nenhum livro cadastrado.')
    } else {
      for (const item of resultado) {
        this.display(
          `${item.titulo} | Empréstimos: ${String(item.quantidade_emprestimos)}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }

  private async handleClientesComEmprestimosAtivos(): Promise<void> {
    const resultado = await this.relatorioService
      .clientesComEmprestimosAtivos()
      .catch((error: unknown) => error as Error)

    if (resultado instanceof Error) {
      this.reportError(resultado)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    this.display('--- Clientes com empréstimos ativos ---')

    if (resultado.length === 0) {
      this.display('Nenhum cliente com empréstimo ativo no momento.')
    } else {
      for (const item of resultado) {
        this.display(
          `${item.nome} | Empréstimos ativos: ${String(item.emprestimos_ativos)}`
        )
      }
    }

    await this.prompt('Pressione ENTER para continuar...')
  }
}
