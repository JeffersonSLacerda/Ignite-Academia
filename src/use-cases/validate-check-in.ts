import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation";

interface ValidateCheckInRequest{
  checkInId: string
}

interface ValidateCheckInResponse{
  checkIn: CheckIn
}

export class ValidateCheckInUseCase{
  constructor(
    private checkInsRepository: CheckInsRepository
  ){}

  async execute({ checkInId }: ValidateCheckInRequest) {
    const checkIn  = await this.checkInsRepository.findById(checkInId)

    if(!checkIn) throw new ResourceNotFoundError()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if(distanceInMinutesFromCheckInCreation > 20) throw new LateCheckInValidationError();
    

    checkIn.validated_at = new Date()

    this.checkInsRepository.save(checkIn)

    return {
      checkIn
    }
  }
}