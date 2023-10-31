import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

describe('#E2E Create Check In Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create check-in in a gym', async () => {
    const {token} = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'DevInDev Gym',
        description: 'Some description.',
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude,
        phone: '(88) 3581-0000'
      }
    })

    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude
      })
    
    expect(createCheckInResponse.statusCode).toEqual(201)
  })
})