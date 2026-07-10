import { ConsoleFormSchema } from '../../utils/console.view'

export class CreateEmprestimoDto {
  constructor(
    public livro_id: number,
    public cliente_id: number,
    public data_prevista_devolucao: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      livro_id: { type: 'number', required: true },
      cliente_id: { type: 'number', required: true },
      data_prevista_devolucao: { type: 'string', required: true }
    }
  }
}
