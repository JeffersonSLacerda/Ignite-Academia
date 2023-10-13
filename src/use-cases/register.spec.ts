import {expect, describe, it, beforeEach, afterEach, vi} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe('#Register UseCase', () =>{
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
    usersRepository.clean()
  })
  
  it('should be able to insert data correctly', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '12345'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const {user} = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash) 

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a user with same email', async () => {
    const email = 'john@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })
    expect(async () => {
       await sut.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})