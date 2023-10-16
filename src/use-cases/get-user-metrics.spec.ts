import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase
describe('#Get User Metrics',()=> {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  afterEach(()=> {
    checkInsRepository.clean()
  })
  it('should be return a checkIns count from metrics by user', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInsRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const {checkInsCount} = await sut.execute({
      userId: 'user_01'
    })

    expect(checkInsCount).toEqual(2)
  })
})