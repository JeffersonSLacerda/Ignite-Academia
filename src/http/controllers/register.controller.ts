import { z } from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"
import { registerUseCase } from "@/use-cases/register.use-case"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {name, email, password} = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({name, email, password})
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}