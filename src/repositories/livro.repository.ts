import { Pool, PoolClient } from 'pg'

import { Livro } from '../models/livro'
import { BaseException } from '../utils/base.exception'

export type CreateLivroInput = Pick<
  Livro,
  | 'titulo'
  | 'isbn'
  | 'ano_publicacao'
  | 'genero'
  | 'quantidade_estoque'
  | 'autor_id'
>

export class LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Livro[]> {
    try {
      const { rows } = await this.pool.query<Livro>(
        'SELECT * FROM livros ORDER BY id'
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao listar livros: '
      })
    }
  }

  async findById(
    id: number,
    executor: Pool | PoolClient = this.pool
  ): Promise<Livro | null> {
    try {
      const { rows } = await executor.query<Livro>(
        'SELECT * FROM livros WHERE id = $1',
        [id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao buscar livro #${String(id)}: `
      })
    }
  }

  async create(livro: CreateLivroInput): Promise<Livro> {
    try {
      const {
        rows: [row]
      } = await this.pool.query<Livro>(
        `INSERT INTO livros (titulo, isbn, ano_publicacao, genero, quantidade_estoque, autor_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          livro.titulo,
          livro.isbn,
          livro.ano_publicacao,
          livro.genero,
          livro.quantidade_estoque,
          livro.autor_id
        ]
      )

      return row
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao cadastrar livro: '
      })
    }
  }

  async update(id: number, livro: CreateLivroInput): Promise<Livro | null> {
    try {
      const { rows } = await this.pool.query<Livro>(
        `UPDATE livros
         SET titulo = $1, isbn = $2, ano_publicacao = $3, genero = $4,
             quantidade_estoque = $5, autor_id = $6
         WHERE id = $7
         RETURNING *`,
        [
          livro.titulo,
          livro.isbn,
          livro.ano_publicacao,
          livro.genero,
          livro.quantidade_estoque,
          livro.autor_id,
          id
        ]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao atualizar livro #${String(id)}: `
      })
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM livros WHERE id = $1', [
        id
      ])

      return (result.rowCount ?? 0) > 0
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao excluir livro #${String(id)}: `
      })
    }
  }

  async decrementarEstoque(id: number, executor: PoolClient): Promise<void> {
    try {
      await executor.query(
        'UPDATE livros SET quantidade_estoque = quantidade_estoque - 1 WHERE id = $1',
        [id]
      )
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao atualizar estoque do livro #${String(id)}: `
      })
    }
  }

  async incrementarEstoque(id: number, executor: PoolClient): Promise<void> {
    try {
      await executor.query(
        'UPDATE livros SET quantidade_estoque = quantidade_estoque + 1 WHERE id = $1',
        [id]
      )
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao atualizar estoque do livro #${String(id)}: `
      })
    }
  }
}
