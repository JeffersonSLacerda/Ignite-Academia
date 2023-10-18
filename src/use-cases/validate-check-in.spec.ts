import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation";
import { error } from "console";

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase
describe('#Check In Validate Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    checkInRepository.clean()
    vi.useRealTimers()
  })
  it('should be able to validate a checkIn', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01' 
    })

    const {checkIn} =await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate any existent checkIn', async () => {
    await expect(() => sut.execute({
      checkInId: 'inexistent_id'
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async ()=> {
    vi.setSystemTime(new Date(2023, 0, 1, 3, 0))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01' 
    })

    const twentyOneMinutes = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutes)

    expect(async () => await sut.execute({
      checkInId: createdCheckIn.id
    })).rejects.toBeInstanceOf(Error)
  })
})