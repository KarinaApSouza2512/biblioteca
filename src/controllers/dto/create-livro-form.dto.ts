import { ConsoleFormSchema } from '../../utils/console.view'

export class CreateLivroDto {
  constructor(
    public titulo: string,
    public isbn: string | null,
    public ano_publicacao: number | null,
    public genero: string | null,
    public quantidade_estoque: number,
    public autor_id: number
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      titulo: { type: 'string', required: true },
      isbn: { type: 'string', required: false },
      ano_publicacao: { type: 'number', required: false },
      genero: { type: 'string', required: false },
      quantidade_estoque: { type: 'number', required: true },
      autor_id: { type: 'number', required: true }
    }
  }
}
