import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
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

  async searchMany(query: string, page: number){
    return this.items
      .filter(gym => gym.title.includes(query))
      .slice((page -1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams){
    const DISTANCE_RADIUS = 5

    return this.items.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber()
        }
      )
      return distance <= DISTANCE_RADIUS
    })
    .slice((params.page -1) * 20, params.page * 20)
  }

  clean() {
    return this.items.splice(0, this.items.length)
  }
}