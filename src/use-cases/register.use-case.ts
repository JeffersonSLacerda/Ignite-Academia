import { hash } from "bcrypt"
interface RegisterUser{
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase{
  constructor(
    private usersRepository: any,
  ) { }

  async execute({email, name, password}: RegisterUser) {
    const password_hash = await hash(password, 6)
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if(userWithSameEmail) throw new Error('This e-mail already exists!')
  
    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}