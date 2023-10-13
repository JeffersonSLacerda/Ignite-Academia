import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymRequest {
  title: string
  description: string | null
  latitude: number
  longitude: number
  phone: string | null
}

interface CreateGymResponse{
  gym: Gym
}

export class CreateGymUseCase{
  constructor(
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    title,
    description,
    latitude,
    longitude,
    phone
  }: CreateGymRequest): Promise<CreateGymResponse>{
    const gym = await this.gymsRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone
    })

    return {
      gym
    }
  }
}