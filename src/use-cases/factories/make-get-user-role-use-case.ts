import { PrismaUsersRepository } from "@/repositories/prisma/prisma-user-repository"
import { GetUserRoleUseCase } from "../get-user-role"

export function makeGetUserRoleUseCase(){
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserRoleUseCase(usersRepository)

  return useCase
}