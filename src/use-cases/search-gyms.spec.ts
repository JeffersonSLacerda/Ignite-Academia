import { afterEach, beforeEach, describe, expect, it} from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase
describe('#Search Gym Use Case', ()=> {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  afterEach(() => {
    gymsRepository.clean()
  })

  it('Should be able to search for gyms', async () => {
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
      latitude: casaLoc.latitude,
      longitude: casaLoc.longitude,
      phone: ''
    })

    const { gyms } = await sut.execute({
      query: 'DevInDev',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({title: 'DevInDev Gym'})
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for(let i =1; i <= 22; i++) {
      await gymsRepository.create({
        title: `DevInDev Gym ${i}`,
        description: '',
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude,
        phone: ''
      })
    }

    const {gyms} = await sut.execute({
      query: 'DevInDev',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({title: 'DevInDev Gym 21'}),
      expect.objectContaining({title: 'DevInDev Gym 22'}),
    ])
  })
})