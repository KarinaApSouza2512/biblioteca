import { CreateAutorDto } from '../controllers/dto/create-autor-form.dto'
import { Autor } from '../models/autor'
import { AutorRepository } from '../repositories/autor.repository'

const NOME_MAX_LENGTH = 150
const NACIONALIDADE_MAX_LENGTH = 100

export class AutorService {
  constructor(private readonly repository: AutorRepository) {}

  async create(data: CreateAutorDto): Promise<Autor> {
    const autor = this.validate(data)

    return await this.repository.create(autor)
  }

  async findAll(): Promise<Autor[]> {
    return await this.repository.findAll()
  }

  async findById(id: number): Promise<Autor | null> {
    return await this.repository.findById(id)
  }

  async update(id: number, data: CreateAutorDto): Promise<Autor> {
    const autor = this.validate(data)

    const updated = await this.repository.update(id, autor)

    if (!updated) {
      throw new Error('Autor não encontrado')
    }

    return updated
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id)
  }

  private validate(data: CreateAutorDto): Omit<Autor, 'id'> {
    const nome = data.nome.trim()

    if (nome.length === 0) {
      throw new Error('O nome do autor é obrigatório')
    }

    if (nome.length > NOME_MAX_LENGTH) {
      throw new Error(
        `O nome do autor deve ter no máximo ${String(NOME_MAX_LENGTH)} caracteres`
      )
    }

    const nacionalidade = this.emptyToNull(data.nacionalidade)

    if (nacionalidade && nacionalidade.length > NACIONALIDADE_MAX_LENGTH) {
      throw new Error(
        `A nacionalidade deve ter no máximo ${String(NACIONALIDADE_MAX_LENGTH)} caracteres`
      )
    }

    const dataNascimento = this.validateDataNascimento(
      this.emptyToNull(data.data_nascimento)
    )

    return { nome, nacionalidade, data_nascimento: dataNascimento }
  }

  private emptyToNull(value?: string | null): string | null {
    const trimmed = value?.trim()

    if (!trimmed) {
      return null
    }

    return trimmed
  }

  private validateDataNascimento(value: string | null): string | null {
    if (!value) {
      return null
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(
        'Data de nascimento inválida. Utilize o formato AAAA-MM-DD'
      )
    }

    if (parsed.getTime() > Date.now()) {
      throw new Error('Data de nascimento não pode estar no futuro')
    }

    return value
  }
}
