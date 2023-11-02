import { PrismaUsersRepository } from "@/repositories/prisma/prisma-user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface GetUserRoleRequest{
  userId: string;
}

interface GetUserRoleResponse{
  role: string;
}

export class GetUserRoleUseCase{
  constructor(
    private usersRepository: PrismaUsersRepository
  ){}

  async execute({userId}: GetUserRoleRequest): Promise<GetUserRoleResponse>{
    const user = await this.usersRepository.findById(userId)

    if(!user) {
      throw new ResourceNotFoundError()
    }

    return {
      role: user.role
    }
  }
}