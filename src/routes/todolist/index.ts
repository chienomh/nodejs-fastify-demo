import { FastifyPluginAsync } from "fastify";
import {
  getAllToDo,
  getSingleToDo,
  createToDo,
  deleteToDo,
  updateToDo,
  uploadFile,
} from "../../controllers/todoController";
import { postSchema } from "../../schemas/todolist/schemaTodo";

const todolist: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get(
    "/",
    {
      onRequest: [fastify.checkAdmin],
    },
    getAllToDo
  );

  fastify.get("/:id", getSingleToDo);

  fastify.post("/", { schema: { body: postSchema } }, createToDo);

  fastify.delete("/:id", deleteToDo);

  fastify.patch("/:id", updateToDo);

  fastify.post("/upload", uploadFile);
};

export default todolist;
