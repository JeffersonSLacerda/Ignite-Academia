import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { profile } from "./controllers/profile.controller";
import { authenticate } from "./controllers/authenticate.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated */
  app.get('/me', profile)
}