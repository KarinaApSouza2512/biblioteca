import { Pool } from 'pg'

import { Cliente } from '../models/cliente'
import { BaseException } from '../utils/base.exception'

export type CreateClienteInput = Pick<
  Cliente,
  'nome' | 'cpf' | 'email' | 'telefone'
>

export class ClienteRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Cliente[]> {
    try {
      const { rows } = await this.pool.query<Cliente>(
        'SELECT * FROM clientes ORDER BY id'
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao listar clientes: '
      })
    }
  }

  async findById(id: number): Promise<Cliente | null> {
    try {
      const { rows } = await this.pool.query<Cliente>(
        'SELECT * FROM clientes WHERE id = $1',
        [id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao buscar cliente #${String(id)}: `
      })
    }
  }

  async create(cliente: CreateClienteInput): Promise<Cliente> {
    try {
      const {
        rows: [row]
      } = await this.pool.query<Cliente>(
        'INSERT INTO clientes (nome, cpf, email, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
        [cliente.nome, cliente.cpf, cliente.email, cliente.telefone]
      )

      return row
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao cadastrar cliente: '
      })
    }
  }

  async update(
    id: number,
    cliente: CreateClienteInput
  ): Promise<Cliente | null> {
    try {
      const { rows } = await this.pool.query<Cliente>(
        'UPDATE clientes SET nome = $1, cpf = $2, email = $3, telefone = $4 WHERE id = $5 RETURNING *',
        [cliente.nome, cliente.cpf, cliente.email, cliente.telefone, id]
      )

      return rows[0] ?? null
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao atualizar cliente #${String(id)}: `
      })
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.pool.query(
        'DELETE FROM clientes WHERE id = $1',
        [id]
      )

      return (result.rowCount ?? 0) > 0
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: `Erro ao excluir cliente #${String(id)}: `
      })
    }
  }
}
