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
  });
  return user;
};
