import { CreateAuthorDto } from '../controllers/dto/create-author-form.dto'
import { Autor } from '../models/autor'
import { AuthorRepository } from '../repositories/author.repository'

export class AuthorService {
  constructor(private readonly repository: AuthorRepository) {}

  async create(data: CreateAuthorDto): Promise<Autor> {
    return await this.repository.create({
      nome: data.nome,
      nacionalidade: data.nacionalidade,
      data_nascimento: data.data_nascimento
    })
  }

  async findAll(): Promise<Autor[]> {
    return await this.repository.findAll()
  }

  async findById(id: number): Promise<Autor | null> {
    return await this.repository.findById(id)
  }

  async update(id: number, data: CreateAuthorDto): Promise<Autor> {
    const updated = await this.repository.update(id, {
      nome: data.nome,
      nacionalidade: data.nacionalidade,
      data_nascimento: data.data_nascimento
    })

    if (!updated) {
      throw new Error('Autor não encontrado')
    }

    return updated
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id)
  }
}
