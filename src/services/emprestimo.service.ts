import { CreateEmprestimoDto } from '../controllers/dto/create-emprestimo-form.dto'
import { Emprestimo } from '../models/emprestimo'
import { ClienteRepository } from '../repositories/cliente.repository'
import { EmprestimoRepository } from '../repositories/emprestimo.repository'
import { LivroRepository } from '../repositories/livro.repository'

export class EmprestimoService {
  constructor(
    private readonly repository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
    private readonly clienteRepository: ClienteRepository
  ) {}

  async registrar(data: CreateEmprestimoDto): Promise<Emprestimo> {
    const livro = await this.livroRepository.findById(data.livro_id)

    if (!livro) {
      throw new Error(`Livro #${String(data.livro_id)} não encontrado`)
    }

    const cliente = await this.clienteRepository.findById(data.cliente_id)

    if (!cliente) {
      throw new Error(`Cliente #${String(data.cliente_id)} não encontrado`)
    }

    if (livro.quantidade_estoque <= 0) {
      throw new Error(
        `O livro "${livro.titulo}" não está disponível no estoque`
      )
    }

    const dataPrevistaDevolucao = this.validateDataPrevistaDevolucao(
      data.data_prevista_devolucao.trim()
    )

    return await this.repository.create({
      livro_id: data.livro_id,
      cliente_id: data.cliente_id,
      data_prevista_devolucao: dataPrevistaDevolucao
    })
  }

  async findAll(): Promise<Emprestimo[]> {
    return await this.repository.findAll()
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const updated = await this.repository.registrarDevolucao(id)

    if (!updated) {
      throw new Error('Empréstimo não encontrado ou já devolvido')
    }

    return updated
  }

  private validateDataPrevistaDevolucao(value: string): string {
    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(
        'Data prevista de devolução inválida. Utilize o formato AAAA-MM-DD'
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (parsed.getTime() < today.getTime()) {
      throw new Error('Data prevista de devolução não pode estar no passado')
    }

    return value
  }
}
