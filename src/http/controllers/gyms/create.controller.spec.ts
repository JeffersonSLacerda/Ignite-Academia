import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

const casaLoc = {
  latitude: -7.231556, 
  longitude: -39.338235
}

describe('#E2E Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const {token} = await createAndAuthenticateUser(app, true)

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'DevInDev Gym',
        description: 'Some description.',
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude,
        phone: '(88) 3581-0000'
      })
    
    expect(createGymResponse.statusCode).toEqual(201)
    expect(createGymResponse.body.gym).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'DevInDev Gym',
        description: expect.any(String),
        phone: expect.any(String),
        latitude: expect.any(String),
        longitude: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    )
  })
})