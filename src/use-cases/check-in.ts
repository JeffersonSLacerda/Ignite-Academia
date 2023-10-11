import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInRequest{
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInResponse{
  checkIn: CheckIn
}


export class CheckInUseCase{
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId, 
    gymId,
    userLatitude,
    userLongitude
  }: CheckInRequest): Promise<CheckInResponse>{
    const gym = await this.gymsRepository.findById(gymId)

    if(!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },{
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    )

    const MAX_DISTANCE_IN_KM = 0.1
    if(distance > MAX_DISTANCE_IN_KM) throw new Error('longe pacarai!')

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

    if(checkInOnSameDay) throw new Error('No mesmo dia não pode!')

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    return {
      checkIn
    }
  }
}