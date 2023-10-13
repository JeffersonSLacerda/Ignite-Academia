import { randomUUID } from "node:crypto";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository{
  public items: User[] = []
  constructor() {}

  async create(data: Prisma.UserCreateInput) {
      const user: User = {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        created_at: new Date(),
        updated_at: new Date(),
      }

      this.items.push(user)

      return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(user => user.email === email)
    
    if(!user) return null
    
    return user;
  }

  async findById(userId: string) {
    const user = this.items.find(user => user.id === userId)
    
    if(!user) return null
    
    return user;
  }

  clean() {
    return this.items.splice(0, this.items.length)
  }
}