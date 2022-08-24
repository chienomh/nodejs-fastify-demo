import { FastifyPluginAsync } from "fastify";
import {
  SignUp,
  getAllUser,
  Login,
  changePassword,
  sendForgotPassword,
  getTokenForgotPassword,
  handleForgotPassword,
} from "../../controllers/authentication";

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/", SignUp);
  fastify.get("/", getAllUser);
  fastify.post("/login", Login);
  fastify.patch("/", { onRequest: [fastify.authenticate] }, changePassword);

  fastify.post("/send", sendForgotPassword);
  fastify.get("/gettokenforgot_password", getTokenForgotPassword);
  fastify.patch(
    "/changepassword",
    { onRequest: [fastify.authenticate] },
    handleForgotPassword
  );
};

export default user;
