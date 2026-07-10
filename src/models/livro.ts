export interface Livro {
  id: number

  titulo: string

  isbn: string | null

  ano_publicacao: number | null

  genero: string | null

  quantidade_estoque: number

  autor_id: number
}
