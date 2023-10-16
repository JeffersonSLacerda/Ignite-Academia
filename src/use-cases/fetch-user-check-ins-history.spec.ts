import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Check-In history Use Case', ()=>{
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  afterEach(()=> {
    checkInsRepository.clean()
  })
  it('Should be able to get a history user check-ins', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInsRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const {checkIns} = await sut.execute({
      userId: 'user_01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({gym_id: 'gym_01'}),
      expect.objectContaining({gym_id: 'gym_02'}),
    ])
  })

  it('Should be able to fetch paginated user check-in history', async () => {
    for (let i  = 1; i <= 22; i++ ) {
      await checkInsRepository.create({
        gym_id: `gym_${i}`,
        user_id: 'user_01',
      })
    }

    const {checkIns} = await sut.execute({
      userId: 'user_01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({gym_id: 'gym_21'}),
      expect.objectContaining({gym_id: 'gym_22'}),
    ])
  })
})
