import { Pool } from 'pg'

import { Autor } from '../models/autor'
import { BaseException } from '../utils/base.exception'

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Autor[]> {
    try {
      const { rows } = await this.pool.query<Autor>(
        'SELECT * FROM autores ORDER BY id'
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao listar autores: '
      })
    }
  }

  async findById(id: number): Promise<Autor | null> {
    try {
      const { rows } = await this.pool.query<Autor>(
        'SELECT * FROM autores WHERE id = $1',
        [id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao buscar autor #${String(id)}: `
      })
    }
  }

  async create(autor: Omit<Autor, 'id'>): Promise<Autor> {
    try {
      const {
        rows: [row]
      } = await this.pool.query<Autor>(
        'INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES ($1, $2, $3) RETURNING *',
        [autor.nome, autor.nacionalidade, autor.data_nascimento]
      )

      return row
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao cadastrar autor: '
      })
    }
  }

  async update(id: number, autor: Omit<Autor, 'id'>): Promise<Autor | null> {
    try {
      const { rows } = await this.pool.query<Autor>(
        'UPDATE autores SET nome = $1, nacionalidade = $2, data_nascimento = $3 WHERE id = $4 RETURNING *',
        [autor.nome, autor.nacionalidade, autor.data_nascimento, id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao atualizar autor #${String(id)}: `
      })
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.pool.query(
        'DELETE FROM autores WHERE id = $1',
        [id]
      )

      return (result.rowCount ?? 0) > 0
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao excluir autor #${String(id)}: `
      })
    }
  }
}
