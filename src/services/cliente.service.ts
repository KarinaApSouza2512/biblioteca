import { CreateClienteDto } from '../controllers/dto/create-cliente-form.dto'
import { Cliente } from '../models/cliente'
import {
  ClienteRepository,
  CreateClienteInput
} from '../repositories/cliente.repository'

const NOME_MAX_LENGTH = 150
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class ClienteService {
  constructor(private readonly repository: ClienteRepository) {}

  async create(data: CreateClienteDto): Promise<Cliente> {
    const cliente = this.validate(data)

    return await this.repository.create(cliente)
  }

  async findAll(): Promise<Cliente[]> {
    return await this.repository.findAll()
  }

  async findById(id: number): Promise<Cliente | null> {
    return await this.repository.findById(id)
  }

  async update(id: number, data: CreateClienteDto): Promise<Cliente> {
    const cliente = this.validate(data)

    const updated = await this.repository.update(id, cliente)

    if (!updated) {
      throw new Error('Cliente não encontrado')
    }

    return updated
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id)
  }

  private validate(data: CreateClienteDto): CreateClienteInput {
    const nome = data.nome.trim()

    if (nome.length === 0) {
      throw new Error('O nome do cliente é obrigatório')
    }

    if (nome.length > NOME_MAX_LENGTH) {
      throw new Error(
        `O nome do cliente deve ter no máximo ${String(NOME_MAX_LENGTH)} caracteres`
      )
    }

    const cpf = this.validateCpf(data.cpf)
    const email = this.validateEmail(this.emptyToNull(data.email))
    const telefone = this.emptyToNull(data.telefone)

    return { nome, cpf, email, telefone }
  }

  private emptyToNull(value?: string | null): string | null {
    const trimmed = value?.trim()

    if (!trimmed) {
      return null
    }

    return trimmed
  }

  private validateCpf(rawCpf: string): string {
    const cpf = rawCpf.replace(/\D/g, '')

    if (!this.isValidCpf(cpf)) {
      throw new Error('CPF inválido')
    }

    return cpf
  }

  private isValidCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    const calcCheckDigit = (base: string): number => {
      let total = 0
      let factor = base.length + 1

      for (const digit of base) {
        total += Number(digit) * factor
        factor--
      }

      const remainder = total % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    const base = cpf.slice(0, 9)
    const digit1 = calcCheckDigit(base)
    const digit2 = calcCheckDigit(base + String(digit1))

    return cpf === base + String(digit1) + String(digit2)
  }

  private validateEmail(email: string | null): string | null {
    if (!email) {
      return null
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new Error('E-mail inválido')
    }

    return email
  }
}
