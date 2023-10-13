import { CheckInUseCase } from "./check-in";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase;

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

const carajasLoc = {
  latitude: -7.226915,
  longitude: -39.338674
}

describe('#Check-in Use Case', () =>{
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(
      checkInsRepository,
      gymsRepository
      )

    await gymsRepository.create({
      id: 'gym-01',
      title: 'DevInDev Gym',
      description: '',
      latitude: new Decimal(casaLoc.latitude),
      longitude: new Decimal(casaLoc.longitude),
      phone: ''
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    gymsRepository.clean()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:casaLoc.latitude,
      userLongitude: casaLoc.longitude
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 9, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:casaLoc.latitude,
      userLongitude: casaLoc.longitude
    })

    expect(async () => {  
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude:-7.2281754,
        userLongitude: -39.3310917
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but on different days', async () => {
    vi.setSystemTime(new Date(2023, 9, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:casaLoc.latitude,
      userLongitude: casaLoc.longitude
    })

    vi.setSystemTime(new Date(2023, 9, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:casaLoc.latitude,
      userLongitude: casaLoc.longitude
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in distant of the gym', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'DevInDev Gym',
      description: '',
      latitude: new Decimal(casaLoc.latitude),
      longitude: new Decimal(casaLoc.longitude),
      phone: ''
    })

    await expect(() => 
      sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: carajasLoc.latitude,
      userLongitude: carajasLoc.longitude
    })).rejects.toBeInstanceOf(Error)
  })
})