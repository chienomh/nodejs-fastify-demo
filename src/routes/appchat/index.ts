import { FastifyPluginAsync } from "fastify";
import { chatApplication } from "../../controllers/chatController";

const appChat: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", chatApplication);
};

export default appChat;
