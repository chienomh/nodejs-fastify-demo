import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
// import validator from "validator";
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    require: [true, "A user must have a email"],
    unique: [true, "A email is duplicate"],
    validate: [validator.isEmail, "Please provide correct email format"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password "],
    select: false,
  },
  role: {
    type: Number,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
