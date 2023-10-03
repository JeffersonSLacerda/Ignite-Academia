import { hash } from "bcrypt"

import { PrismaUsersRepository } from "@/repositories/prisma-user-repository";
import { prisma } from "@/lib/prisma";

interface RegisterUser{
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({email, name, password}: RegisterUser) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(userWithSameEmail) throw new Error('This e-mail already exists!')

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash
  })
}