import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import fastifyStatic from "@fastify/static";
const path = require("path");

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  fastify.register(require("./routes/todolist"), { prefix: "api/v1/todolist" });
  fastify.register(require("./routes/user"), { prefix: "api/v1/user" });

  fastify.register(require("fastify-mailer"), {
    defaults: { from: "Chientd <chienomg@gmail.com>" },
    transport: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: "chienomg@gmail.com",
        pass: process.env.APP_PASS,
      },
    },
  });

  void fastify.register(fastifyStatic, {
    root: path.join(__dirname, "./views"),
  });
};

export default app;
export { app };
