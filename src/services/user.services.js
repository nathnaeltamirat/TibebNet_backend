const User = require("../models/user.model");
const CustomError = require("../utils/customError");
const { status } = require("http-status");

exports.createUser = async (body) => {
  const { username, email, password, confirmPassword, role = "user" } = body;
  if (await User.isEmailTaken(email)) {
    throw new CustomError(status.BAD_REQUEST, "Email already taken");
  }
  if (password !== confirmPassword) {
    throw new CustomError(
      status.BAD_REQUEST,
      "Password and confirm password do not match"
    );
  }
  const user = await User.create({
    username,
    email,
    password,
    role,
  });
  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new CustomError(status.UNAUTHORIZED, "Invalid email or password");
  }
  return user;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError(status.NOT_FOUND, "User not found");
  }
  return user;
};

exports.findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails[0].value;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email: email,
      googleId: profile.id,
    });
  }
  return user;
};
