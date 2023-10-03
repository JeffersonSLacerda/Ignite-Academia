import { hash } from "bcrypt"

import { PrismaUsersRepository } from "@/repositories/prisma-user-repository";

interface RegisterUser{
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({email, name, password}: RegisterUser) {
  const password_hash = await hash(password, 6)
  const prismaUsersRepository = new PrismaUsersRepository()

  const userWithSameEmail = await prismaUsersRepository.findByEmail(email)

  if(userWithSameEmail) throw new Error('This e-mail already exists!')

  await prismaUsersRepository.create({
    name,
    email,
    password_hash
  })
}