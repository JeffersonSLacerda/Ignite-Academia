import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";

describe('#E2E Refresh Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'john.doe@example.com',
        password: '123456'
      })

    const cookie = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  })
})