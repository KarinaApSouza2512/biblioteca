import { Pool } from 'pg'

import {
  ClienteComEmprestimosAtivos,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmprestado,
  LivrosPorAutor
} from '../models/relatorio'
import { BaseException } from '../utils/base.exception'

const LIMIT_PADRAO = 50
const LIMIT_RANKING = 10

export class RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async livrosDisponiveis(limit = LIMIT_PADRAO): Promise<LivroDisponivel[]> {
    try {
      const { rows } = await this.pool.query<LivroDisponivel>(
        `SELECT l.id, l.titulo, a.nome AS autor_nome, l.quantidade_estoque
         FROM livros l
         INNER JOIN autores a ON a.id = l.autor_id
         WHERE l.quantidade_estoque > 0
         ORDER BY l.titulo
         LIMIT $1`,
        [limit]
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao gerar relatório de livros disponíveis: '
      })
    }
  }

  async livrosEmprestados(limit = LIMIT_PADRAO): Promise<LivroEmprestado[]> {
    try {
      const { rows } = await this.pool.query<LivroEmprestado>(
        `SELECT l.id AS livro_id, l.titulo, a.nome AS autor_nome, c.nome AS cliente_nome,
                e.data_emprestimo, e.data_prevista_devolucao
         FROM emprestimos e
         INNER JOIN livros l ON l.id = e.livro_id
         INNER JOIN autores a ON a.id = l.autor_id
         INNER JOIN clientes c ON c.id = e.cliente_id
         WHERE e.status = 'em_andamento'
         ORDER BY e.data_prevista_devolucao
         LIMIT $1`,
        [limit]
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao gerar relatório de livros emprestados: '
      })
    }
  }

  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    try {
      const { rows } = await this.pool.query<LivrosPorAutor>(
        `SELECT a.id AS autor_id, a.nome AS autor_nome,
                COUNT(l.id)::int AS quantidade_livros,
                COALESCE(SUM(l.quantidade_estoque), 0)::int AS estoque_total
         FROM autores a
         LEFT JOIN livros l ON l.autor_id = a.id
         GROUP BY a.id, a.nome
         ORDER BY quantidade_livros DESC, a.nome`
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao gerar relatório de livros por autor: '
      })
    }
  }

  async emprestimosPorLivro(
    limit = LIMIT_RANKING
  ): Promise<EmprestimosPorLivro[]> {
    try {
      const { rows } = await this.pool.query<EmprestimosPorLivro>(
        `SELECT l.id AS livro_id, l.titulo,
                COUNT(e.id)::int AS quantidade_emprestimos
         FROM livros l
         LEFT JOIN emprestimos e ON e.livro_id = l.id
         GROUP BY l.id, l.titulo
         ORDER BY quantidade_emprestimos DESC, l.titulo
         LIMIT $1`,
        [limit]
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix: 'Erro ao gerar relatório de empréstimos por livro: '
      })
    }
  }

  async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]> {
    try {
      const { rows } = await this.pool.query<ClienteComEmprestimosAtivos>(
        `SELECT c.id AS cliente_id, c.nome,
                COUNT(e.id)::int AS emprestimos_ativos
         FROM clientes c
         INNER JOIN emprestimos e ON e.cliente_id = c.id
         WHERE e.status = 'em_andamento'
         GROUP BY c.id, c.nome
         ORDER BY emprestimos_ativos DESC, c.nome`
      )

      return rows
    } catch (error) {
      throw BaseException.fromUnknown(error, {
        messagePrefix:
          'Erro ao gerar relatório de clientes com empréstimos ativos: '
      })
    }
  }
}
