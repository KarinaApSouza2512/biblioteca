import { Pool } from 'pg'

import { Autor } from '../models/autor'

export class AuthorRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Autor[]> {
    const { rows } = await this.pool.query<Autor>(
      'SELECT * FROM autores ORDER BY id'
    )

    return rows
  }

  async findById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      'SELECT * FROM autores WHERE id = $1',
      [id]
    )

    return rows[0] ?? null
  }

  async create(author: Omit<Autor, 'id'>): Promise<Autor> {
    const {
      rows: [row]
    } = await this.pool.query<Autor>(
      'INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES ($1, $2, $3) RETURNING *',
      [author.nome, author.nacionalidade, author.data_nascimento]
    )

    return row
  }

  async update(id: number, author: Omit<Autor, 'id'>): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      'UPDATE autores SET nome = $1, nacionalidade = $2, data_nascimento = $3 WHERE id = $4 RETURNING *',
      [author.nome, author.nacionalidade, author.data_nascimento, id]
    )

    return rows[0] ?? null
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM autores WHERE id = $1', [
      id
    ])

    return (result.rowCount ?? 0) > 0
  }
}
