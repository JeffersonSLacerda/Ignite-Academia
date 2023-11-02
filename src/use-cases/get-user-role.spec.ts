import { InMemoryUsersRepository } from "@/repositories/in-memory/users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
describe('#Get User Role UseCase', () =>{
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user role', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'MEMBER',
      password_hash: '$2b$06$.WX2HoHaw.P3sdWnS4gHYOdqehPqt6jRGwV4gdzub2itGkQ2nhjyO'
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(createdUser.id)
    expect(user.name).toEqual(createdUser.name)
    expect(user.email).toEqual(createdUser.email)
    expect(user.role).toEqual(createdUser.role)
  })
})