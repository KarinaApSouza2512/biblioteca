import { ConsoleFormSchema } from '../../utils/console.view'

export class CreateAuthorDto {
  constructor(
    public nome: string,
    public nacionalidade: string | null,
    public data_nascimento: string | null
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true },
      nacionalidade: { type: 'string', required: false },
      data_nascimento: { type: 'string', required: false }
    }
  }
}
