import { makeGetUserRoleUseCase } from "@/use-cases/factories/make-get-user-role-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { userInfo } from "node:os";

export async function refresh(request: FastifyRequest, reply: FastifyReply){
  await request.jwtVerify({
    onlyCookie: true
  })

  const getUserRole = makeGetUserRoleUseCase()
  const role = await getUserRole.execute({userId: request.user.sub})

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub
      }
    }
  )

  const refreshToken = await reply.jwtSign(
    {
      role
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d'
      }
    }
  )

  return reply
    .status(200)
    .setCookie('refreshToken', refreshToken,{
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true
    })
    .send({
      token,
    })
}