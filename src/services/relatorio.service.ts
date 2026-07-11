import {
  ClienteComEmprestimosAtivos,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmprestado,
  LivrosPorAutor
} from '../models/relatorio'
import { RelatorioRepository } from '../repositories/relatorio.repository'

export class RelatorioService {
  constructor(private readonly repository: RelatorioRepository) {}

  async livrosDisponiveis(): Promise<LivroDisponivel[]> {
    return await this.repository.livrosDisponiveis()
  }

  async livrosEmprestados(): Promise<LivroEmprestado[]> {
    return await this.repository.livrosEmprestados()
  }

  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    return await this.repository.livrosPorAutor()
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    return await this.repository.emprestimosPorLivro()
  }

  async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]> {
    return await this.repository.clientesComEmprestimosAtivos()
  }
}
