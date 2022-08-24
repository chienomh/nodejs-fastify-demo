import { FastifyReply, FastifyRequest } from "fastify";
import ToDo from "../models/toDoModel";
import APIFeatures from "../utils/apiFeature";
import { cloudinary } from "../utils/cloudinary";

type Params = {
  id: String;
};

type ParamsTodo = {
  name?: String;
  status?: Boolean;
};

async function getAllToDo(req: FastifyRequest, reply: FastifyReply) {
  const features = new APIFeatures(ToDo.find(), req.query as String)
    .filter()
    .sort()
    .paginate()
    .search();

  const todoList = await features.query;

  reply.status(200).send({
    status: "success",
    result: todoList.length,
    todoList,
  });
}

async function getSingleToDo(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as Params;
    const data = await ToDo.findById(id);
    if (data) {
      reply.status(200).send({
        status: "success",
        data,
      });
    } else {
      reply.notFound();
    }
  } catch (error) {
    reply.status(500).send({
      status: "fail",
      message: error,
    });
  }
}

async function createToDo(req: FastifyRequest, reply: FastifyReply) {
  const { name, status } = req.body as ParamsTodo;

  const data = await ToDo.create({ name, status });
  reply.status(201).send(data);
}

async function deleteToDo(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as Params;

  const data = await ToDo.findById(id);

  if (!data) {
    reply.status(404).send({
      status: "fail",
      message: `Not found with id = ${id}`,
    });
  } else {
    await ToDo.findByIdAndDelete(id);
    reply.status(200).send({
      status: "success",
      message: "delete successful",
    });
  }
}

async function updateToDo(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as Params;
  const { name, status } = req.body as ParamsTodo;

  if (name === undefined && status === undefined) {
    reply.status(400).send({
      status: "fail",
      message: "Required name or status",
    });
  } else {
    const data = await ToDo.findByIdAndUpdate(id, req.body as ParamsTodo, {
      new: true,
      runValidators: true,
    });
    reply.status(200).send({
      status: "success",
      data,
    });
  }
}

async function uploadFile(req: FastifyRequest, reply: FastifyReply) {
  const files = await req.saveRequestFiles();

  const result = await cloudinary.uploader.upload(files[0].filepath);

  reply.send({ msg: "success", data: result });
}

export {
  getAllToDo,
  getSingleToDo,
  createToDo,
  deleteToDo,
  updateToDo,
  uploadFile,
};
