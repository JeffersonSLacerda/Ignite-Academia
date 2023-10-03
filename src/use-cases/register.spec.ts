import {expect, describe, it, beforeEach} from 'vitest'
import { RegisterUseCase } from './register.use-case'
import { compare } from 'bcrypt'
import { InMemoryUserRepository } from '@/repositories/in-memory/user-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-esists-error'

describe('#Register UseCase', () =>{
  it('should be able to insert data correctly', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '12345'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository()

    const registerUseCase = new RegisterUseCase(
      usersRepository
    );

    const {user} = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash) 

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a user with same email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(
      usersRepository
    );

    const email = 'john@doe.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })
    expect(async () => {
       await registerUseCase.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})