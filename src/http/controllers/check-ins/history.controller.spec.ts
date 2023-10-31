import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

describe('#E2E Check In History Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list a history of check-ins', async () => {
    const {token} = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'DevInDev Gym',
        description: 'Some description.',
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude,
        phone: '(88) 3581-0000'
      }
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id
        },
        {
          gym_id: gym.id,
          user_id: user.id
        }
      ]
    })

    const checkInsHistoryResponse = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    
    expect(checkInsHistoryResponse.statusCode).toEqual(200)
    expect(checkInsHistoryResponse.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id
      }),
    ])
  })
})