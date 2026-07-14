import { Pool } from 'pg'

import { Emprestimo } from '../models/emprestimo'
import { BaseException } from '../utils/base.exception'

export type CreateEmprestimoInput = Pick<
  Emprestimo,
  'livro_id' | 'cliente_id' | 'data_prevista_devolucao'
>

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

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

  async create(data: CreateEmprestimoInput): Promise<Emprestimo> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const estoqueResult = await client.query<{ id: number }>(
        `UPDATE livros
         SET quantidade_estoque = quantidade_estoque - 1
         WHERE id = $1 AND quantidade_estoque > 0
         RETURNING id`,
        [data.livro_id]
      )

      if (estoqueResult.rows.length === 0) {
        throw new Error('Livro indisponível para empréstimo')
      }

      const {
        rows: [emprestimo]
      } = await client.query<Emprestimo>(
        'INSERT INTO emprestimos (livro_id, cliente_id, data_prevista_devolucao) VALUES ($1, $2, $3) RETURNING *',
        [data.livro_id, data.cliente_id, data.data_prevista_devolucao]
      )

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

      await client.query(
        'UPDATE livros SET quantidade_estoque = quantidade_estoque + 1 WHERE id = $1',
        [emprestimo.livro_id]
      )

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
