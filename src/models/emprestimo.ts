export type StatusEmprestimo = 'em_andamento' | 'devolvido' | 'atrasado'

export interface Emprestimo {
  id: number

  livro_id: number

  cliente_id: number

  data_emprestimo: string

  data_prevista_devolucao: string

  data_devolucao: string | null

  status: StatusEmprestimo
}
