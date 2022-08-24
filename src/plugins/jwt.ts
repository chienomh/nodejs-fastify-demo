import fp from "fastify-plugin";
import { fastifyJwt, FastifyJwtSignOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

interface dataUser {
  id: String;
  role: Number;
}

export default fp<FastifyJwtSignOptions>(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "",
  });

  fastify.decorate(
    "authenticate",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
        // req.user = user;
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastify.decorate(
    "checkAdmin",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
        const user = req.user as dataUser;

        if (user.role !== 1) {
          reply.forbidden();
        }
      } catch (err) {
        reply.send(err);
      }
    }
  );
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate(): Promise<void>;
    checkAdmin(): Promise<void>;
  }
}
