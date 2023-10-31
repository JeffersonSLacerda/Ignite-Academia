import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

describe('#E2E Validate Check In Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in in a gym', async () => {
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

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      },
    })

    
    const validateCheckInResponse = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      
    expect(validateCheckInResponse.statusCode).toEqual(204)

    const validatedCheckIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id
      }
    })

    expect(validatedCheckIn.validated_at).toEqual(expect.any(Date))
  })
})