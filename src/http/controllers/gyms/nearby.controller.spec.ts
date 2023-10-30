import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

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

describe('#E2E Nearby Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find nearby gyms', async () => {
    const {token} = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'DevInDev Gym',
        description: 'Some description.',
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude,
        phone: '(88) 3581-0000'
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: '',
        latitude: padariaLoc.latitude,
        longitude: padariaLoc.longitude,
        phone: ''
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'PeCicero Gym',
        description: '',
        latitude: ortoLoc.latitude,
        longitude: ortoLoc.longitude,
        phone: ''
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: casaLoc.latitude,
        longitude: casaLoc.longitude
      })
      .set('Authorization', `Bearer ${token}`)
      .send()
    
    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'DevInDev Gym'
      }),
      expect.objectContaining({
        title: 'TypeScript Gym'
      }),
    ])
  })
})