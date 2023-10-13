import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
describe('#Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  afterEach(() => {
    gymsRepository.clean()
  })
  it('it should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'DevInDev Gym',
      description: '',
      latitude: casaLoc.latitude,
      longitude: casaLoc.longitude,
      phone: ''
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})