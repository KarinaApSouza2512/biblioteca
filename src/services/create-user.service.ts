import { CreateUserDto } from '../controllers/dto/create-user-form.dto'
import { Usuario } from '../models/user'
import { UserRepository } from '../repositories/user.repository'

export class CreateUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: CreateUserDto): Promise<Usuario> {
    const existingUser = await this.repository.findByLogin(user.login)

    if (existingUser) {
      throw new Error('Usuário já cadastrado')
    }

    return await this.repository.create(user)
  }
}
