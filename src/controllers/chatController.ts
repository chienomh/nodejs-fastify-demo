import { FastifyRequest, FastifyReply } from "fastify";
import * as fs from "fs/promises";
import path = require("path");
// import fastify from "fastify";
// import socketioServer from "fastify-socket.io";

async function chatApplication(req: FastifyRequest, reply: FastifyReply) {
  const data = await fs.readFile(
    path.join(__dirname, "../views/appchat.html"),
    { encoding: "utf8" }
  );
  reply.type(" text/html; charset=UTF-8").send(data);
}

export { chatApplication };
