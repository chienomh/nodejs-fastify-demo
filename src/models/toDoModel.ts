import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Todo must have a name"],
    trim: true,
    unique: true,
  },
  status: {
    type: Boolean,
    required: [true, "A Todo must have a status"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const ToDo = mongoose.model("lists", todoSchema);

export default ToDo;
