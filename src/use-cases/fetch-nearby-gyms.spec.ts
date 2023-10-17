import { afterEach, beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

const padariaLoc = {
  latitude: -7.233489, 
  longitude: -39.338875
}

const ortoLoc = {
  latitude: -7.179900,
  longitude: -39.330090
}

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
describe('#Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  afterEach(() => {
    gymsRepository.clean()
  })

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'DevInDev Gym',
      description: '',
      latitude: casaLoc.latitude,
      longitude: casaLoc.longitude,
      phone: ''
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      latitude: padariaLoc.latitude,
      longitude: padariaLoc.longitude,
      phone: ''
    })

    await gymsRepository.create({
      title: 'PeCicero Gym',
      description: '',
      latitude: ortoLoc.latitude,
      longitude: ortoLoc.longitude,
      phone: ''
    })



    const { gyms } = await sut.execute({
      userLatitude: casaLoc.latitude,
      userLongitude: casaLoc.longitude,
      page: 1
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({title: 'DevInDev Gym'}),
      expect.objectContaining({title: 'TypeScript Gym'})
    ])
  })
})