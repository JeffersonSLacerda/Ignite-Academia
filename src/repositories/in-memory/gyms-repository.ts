import { GymsRepository } from "../gyms-repository";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository{
  public items: Gym[] = []

  async findById(gymId: string) {
    return this.items.find(gym => gym.id === gymId) ?? null
  }
  
  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.items.push(gym)
    
    return gym
  }

  clean() {
    return this.items.splice(0, this.items.length)
  }
}