import fp from "fastify-plugin";
import fastifyIO from "fastify-socket.io";

export default fp(async (fastify, opts) => {
  fastify.register(fastifyIO);

  fastify.ready().then(() => {
    fastify.io.on("connection", (socket: any) => {
      console.log("connected");
      socket.on("chat message", (msg: any) => {
        fastify.io.emit("chat message", msg);
      });
    });
  });
});
