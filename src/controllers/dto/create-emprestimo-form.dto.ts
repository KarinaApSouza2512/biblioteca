export class CreateEmprestimoDto {
  constructor(
    public livro_id: number,
    public cliente_id: number,
    public data_prevista_devolucao: string
  ) {}
}
