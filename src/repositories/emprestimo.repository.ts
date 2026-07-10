import { Pool } from 'pg'

import { LivroRepository } from './livro.repository'
import { Emprestimo } from '../models/emprestimo'
import { BaseException } from '../utils/base.exception'

export type CreateEmprestimoInput = Pick<
  Emprestimo,
  'livro_id' | 'cliente_id' | 'data_prevista_devolucao'
>

export class EmprestimoRepository {
  constructor(
    private readonly pool: Pool,
    private readonly livroRepository: LivroRepository
  ) {}

  async findAll(): Promise<Emprestimo[]> {
    try {
      const { rows } = await this.pool.query<Emprestimo>(
        'SELECT * FROM emprestimos ORDER BY id'
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao listar empréstimos: '
      })
    }
  }

  async findById(id: number): Promise<Emprestimo | null> {
    try {
      const { rows } = await this.pool.query<Emprestimo>(
        'SELECT * FROM emprestimos WHERE id = $1',
        [id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao buscar empréstimo #${String(id)}: `
      })
    }
  }

  async create(data: CreateEmprestimoInput): Promise<Emprestimo> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const {
        rows: [emprestimo]
      } = await client.query<Emprestimo>(
        'INSERT INTO emprestimos (livro_id, cliente_id, data_prevista_devolucao) VALUES ($1, $2, $3) RETURNING *',
        [data.livro_id, data.cliente_id, data.data_prevista_devolucao]
      )

      await this.livroRepository.decrementarEstoque(data.livro_id, client)

      await client.query('COMMIT')

      return emprestimo
    } catch (error) {
      await client.query('ROLLBACK')
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao registrar empréstimo: '
      })
    } finally {
      client.release()
    }
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const result = await client.query<Emprestimo>(
        `UPDATE emprestimos
         SET data_devolucao = CURRENT_DATE, status = 'devolvido'
         WHERE id = $1 AND status = 'em_andamento'
         RETURNING *`,
        [id]
      )

      if (result.rows.length === 0) {
        await client.query('ROLLBACK')
        return null
      }

      const emprestimo = result.rows[0]

      await this.livroRepository.incrementarEstoque(emprestimo.livro_id, client)

      await client.query('COMMIT')

      return emprestimo
    } catch (error) {
      await client.query('ROLLBACK')
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao registrar devolução do empréstimo #${String(id)}: `
      })
    } finally {
      client.release()
    }
  }
}
