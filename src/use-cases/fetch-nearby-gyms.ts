import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsRequest{
  userLatitude: number
  userLongitude: number
  page: number
}

interface FetchNearbyGymsResponse{
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase{
  constructor(
    private gymsRepository: GymsRepository
  ){}

  async execute({
    userLatitude,
    userLongitude,
    page
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse>{
    const gyms  = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page
    })
    
    return {
      gyms
    }
  }
}