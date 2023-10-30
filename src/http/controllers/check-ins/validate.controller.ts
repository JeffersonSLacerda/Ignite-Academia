import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply){
  const validateCheckInQuerySchema = z.object({
    checkInId: z.string().uuid()
  })

  const {checkInId} = validateCheckInQuerySchema.parse(request.query)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  const {checkIn} = await validateCheckInUseCase.execute({checkInId})

  return reply.status(200).send({
    checkIn
  })
}