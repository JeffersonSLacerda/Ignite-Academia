import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import {describe, it, expect, beforeEach} from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('#Authentication UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to login with valid credentials', async () =>{
    const registerUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: '$2b$06$.WX2HoHaw.P3sdWnS4gHYOdqehPqt6jRGwV4gdzub2itGkQ2nhjyO',
    })

    const { user } = await sut.execute({
      email: 'john@doe.com',
      password: '12345'
    })


    expect(user.email).toEqual(registerUser.email)
    expect(user.password_hash).toEqual(registerUser.password_hash)
  })

  it('should not be able to authenticate with a invalid email', async () =>{
    expect(async () =>
      await sut.execute({
        email: 'john@doe.com',
        password: '12345'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () =>{
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: '$2b$06$.WX2HoHaw.P3sdWnS4gHYOdqehPqt6jRGwV4gdzub2itGkQ2nhjyO',
    })

    expect(async () =>
      await sut.execute({
        email: 'john@doe.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})