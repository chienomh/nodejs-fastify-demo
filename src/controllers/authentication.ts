import { FastifyReply, FastifyRequest } from "fastify";
import User from "../models/userModel";
import { checkPassword } from "../utils/checkPassword";
const bcrypt = require("bcryptjs");

interface typeUser {
  name: String;
  password: String;
  role: Number;
  email: String;
  newPassword?: String;
}

interface typeForgot {
  id: string;
  token: string;
}

async function SignUp(req: FastifyRequest, reply: FastifyReply) {
  const { name, password, role, email } = req.body as typeUser;

  if (!email || !password || !name) {
    reply.status(400).send({
      status: "fail",
      message: "Please provide email or password",
    });
  } else {
    const data = await User.create({ name, password, role, email });
    reply.status(200).send({
      status: "success",
      data,
    });
  }
}

async function getAllUser(req: FastifyRequest, reply: FastifyReply) {
  const data = await User.find();
  reply.status(200).send({
    status: "success",
    data,
  });
}

async function getSingleUser(req: FastifyRequest, reply: FastifyReply) {
  const { email } = req.body as typeUser;

  const user = User.find({ email });

  if (!user) {
    reply.status(400).send({
      status: "fail",
      message: "Can not found user",
    });
  }

  reply.status(200).send({
    status: "success",
    user,
  });
}

async function Login(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as typeUser;

  if (!email || !password) {
    reply.status(400).send({
      status: "fail",
      message: "Please provide email or password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await checkPassword(password, user.password))) {
    reply.status(400).send({
      status: "fail",
      message: "Email or password Incorrect",
    });
  }

  const token = req.server.jwt.sign(
    { id: user?.id, role: user?.role },
    {
      expiresIn: "5m",
    }
  );

  reply.status(200).send({
    status: "success",
    message: "Login successful",
    token,
  });
}

async function changePassword(req: FastifyRequest, reply: FastifyReply) {
  const { password, newPassword, email } = req.body as typeUser;

  if (!password || !newPassword || !email) {
    reply.status(400).send({
      status: "fail",
      message: "Please provide email, old password and new password!",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    reply.status(400).send({
      status: "fail",
      message: "Can not found user",
    });
  }

  if (!(await checkPassword(password, user!.password))) {
    reply.status(400).send({
      status: "fail",
      message: "Incorrect password",
    });
  }

  const pass = await bcrypt.hash(newPassword, 12);

  await User.findByIdAndUpdate(user?._id, { password: pass });
  reply.status(200).send({
    status: "success",
    message: "change password successful!",
  });
}

async function sendForgotPassword(req: any, reply: FastifyReply) {
  const { mailer } = req.server;

  const { email } = req.body as typeUser;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    reply.status(404).send({
      message: "Email is not resgiter",
    });
  }

  const token = req.server.jwt.sign(
    { id: user?._id },
    {
      expiresIn: "5m",
    }
  );

  const link = `http://127.0.0.1:3000/api/v1/user/gettokenforgot_password?id=${user?.id}&token=${token}`;

  reply.send({
    data: link,
  });

  mailer.sendMail(
    {
      to: "taducchiennb01@gmail.com",
      subject: "Forgot password",
      text: `Click ${link} to reset password`,
    },
    (errors: Error, info: any) => {
      if (errors) {
        reply.status(500);
        return {
          status: "error",
          message: "Something went wrong",
        };
      }

      reply.status(200).send({
        status: "ok",
        message: "Email successfully sent",
        info: {
          from: info.from,
          to: info.to,
        },
      });
    }
  );
}

interface typeConfirmPassword {
  password: string;
  confirmPassword: string;
  id: String;
}
async function handleForgotPassword(req: FastifyRequest, reply: FastifyReply) {
  const { password, confirmPassword, id } = req.body as typeConfirmPassword;

  if (password !== confirmPassword) {
    reply.status(400).send({
      message: "Password incorrect",
    });
  }

  const hashPassword = await bcrypt.hash(password, 12);

  await User.findByIdAndUpdate(id, { password: hashPassword });

  reply.status(200).send({
    message: "change password successful!",
  });
}

async function getTokenForgotPassword(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id, token } = req.query as typeForgot;

  const user = User.findById(id);

  if (!user) {
    reply.status(400).send({
      message: "can not found user wiht id",
    });
  }

  try {
    await req.server.jwt.verify(token);
  } catch (error) {
    reply.unauthorized();
  }

  reply.status(200).send({
    data: {
      id,
      token,
    },
  });
}

export {
  SignUp,
  getAllUser,
  Login,
  getSingleUser,
  changePassword,
  sendForgotPassword,
  handleForgotPassword,
  getTokenForgotPassword,
};
