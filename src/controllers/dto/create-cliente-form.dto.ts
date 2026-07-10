import { ConsoleFormSchema } from '../../utils/console.view'

export class CreateClienteDto {
  constructor(
    public nome: string,
    public cpf: string,
    public email: string | null,
    public telefone: string | null
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true },
      cpf: { type: 'string', required: true },
      email: { type: 'string', required: false },
      telefone: { type: 'string', required: false }
    }
  }
}
