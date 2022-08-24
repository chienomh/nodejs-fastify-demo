import fp from "fastify-plugin";

import connect from "../db/connect";

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify, opts) => {
  await connect(process.env.DATABASE_LOCAL || "");

  fastify.decorate("connectDb", connect);
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    connect: typeof connect;
  }
}
