import { CreateLivroDto } from '../controllers/dto/create-livro-form.dto'
import { Livro } from '../models/livro'
import { AutorRepository } from '../repositories/autor.repository'
import {
  CreateLivroInput,
  LivroRepository
} from '../repositories/livro.repository'

const TITULO_MAX_LENGTH = 200
const ISBN_MAX_LENGTH = 20
const GENERO_MAX_LENGTH = 80
const ISBN_REGEX = /^[0-9-]+$/
const ANO_MINIMO = 1450

export class LivroService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly autorRepository: AutorRepository
  ) {}

  async create(data: CreateLivroDto): Promise<Livro> {
    const livro = await this.validate(data)

    return await this.repository.create(livro)
  }

  async findAll(): Promise<Livro[]> {
    return await this.repository.findAll()
  }

  async findById(id: number): Promise<Livro | null> {
    return await this.repository.findById(id)
  }

  async update(id: number, data: CreateLivroDto): Promise<Livro> {
    const livro = await this.validate(data)

    const updated = await this.repository.update(id, livro)

    if (!updated) {
      throw new Error('Livro não encontrado')
    }

    return updated
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id)
  }

  private async validate(data: CreateLivroDto): Promise<CreateLivroInput> {
    const titulo = data.titulo.trim()

    if (titulo.length === 0) {
      throw new Error('O título do livro é obrigatório')
    }

    if (titulo.length > TITULO_MAX_LENGTH) {
      throw new Error(
        `O título deve ter no máximo ${String(TITULO_MAX_LENGTH)} caracteres`
      )
    }

    const isbn = this.validateIsbn(this.emptyToNull(data.isbn))
    const genero = this.emptyToNull(data.genero)

    if (genero && genero.length > GENERO_MAX_LENGTH) {
      throw new Error(
        `O gênero deve ter no máximo ${String(GENERO_MAX_LENGTH)} caracteres`
      )
    }

    const anoPublicacao = this.validateAnoPublicacao(data.ano_publicacao)

    if (
      !Number.isInteger(data.quantidade_estoque) ||
      data.quantidade_estoque < 0
    ) {
      throw new Error(
        'A quantidade em estoque deve ser um número inteiro maior ou igual a zero'
      )
    }

    if (!Number.isInteger(data.autor_id)) {
      throw new Error('Informe um ID de autor válido')
    }

    const autor = await this.autorRepository.findById(data.autor_id)

    if (!autor) {
      throw new Error(`Autor #${String(data.autor_id)} não encontrado`)
    }

    return {
      titulo,
      isbn,
      ano_publicacao: anoPublicacao,
      genero,
      quantidade_estoque: data.quantidade_estoque,
      autor_id: data.autor_id
    }
  }

  private validateIsbn(isbn: string | null): string | null {
    if (!isbn) {
      return null
    }

    if (isbn.length > ISBN_MAX_LENGTH || !ISBN_REGEX.test(isbn)) {
      throw new Error('ISBN inválido. Utilize apenas números e hífens')
    }

    return isbn
  }

  private validateAnoPublicacao(ano: number | null): number | null {
    if (ano === null) {
      return null
    }

    const anoAtual = new Date().getFullYear()

    if (!Number.isInteger(ano) || ano < ANO_MINIMO || ano > anoAtual) {
      throw new Error(
        `Ano de publicação inválido. Deve estar entre ${String(ANO_MINIMO)} e ${String(anoAtual)}`
      )
    }

    return ano
  }

  private emptyToNull(value?: string | null): string | null {
    const trimmed = value?.trim()

    if (!trimmed) {
      return null
    }

    return trimmed
  }
}
