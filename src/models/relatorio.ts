export interface LivroDisponivel {
  id: number

  titulo: string

  autor_nome: string

  quantidade_estoque: number
}

export interface LivroEmprestado {
  livro_id: number

  titulo: string

  autor_nome: string

  cliente_nome: string

  data_emprestimo: string

  data_prevista_devolucao: string
}

export interface LivrosPorAutor {
  autor_id: number

  autor_nome: string

  quantidade_livros: number

  estoque_total: number
}

export interface EmprestimosPorLivro {
  livro_id: number

  titulo: string

  quantidade_emprestimos: number
}

export interface ClienteComEmprestimosAtivos {
  cliente_id: number

  nome: string

  emprestimos_ativos: number
}
