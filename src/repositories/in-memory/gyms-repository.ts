import { Decimal } from "@prisma/client/runtime/library";
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
      latitude: data.latitude as Decimal,
      longitude: data.longitude as Decimal,
      phone: data.phone ?? null
    }

    this.items.push(gym)
    
    return gym
  }

  clean() {
    return this.items.splice(0, this.items.length)
  }
}