const User = require("../models/user.model");
const CustomError = require("../utils/customError");
const { status } = require("http-status");

exports.createUser = async (body) => {
  const { username, email, password } = body;
  if (await User.isEmailTaken(email)) {
    throw new CustomError(status.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create({
    username,
    email,
    password,
    role,
  });
  return user;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError(status.NOT_FOUND, "User not found");
  }
  return user;
};
