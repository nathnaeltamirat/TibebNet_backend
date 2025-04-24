const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { status } = require("http-status");
const CustomError = require("../utils/customError");

exports.generateToken = async (payload) => {
  const token = await jwt.sign(payload, config.jwt.jwtSecret, {
    expiresIn: "1h",
  });
  return token;
};

exports.verifyToken = async (token) => {
  const payload = await jwt.verify(token, config.jwt.jwtSecret);
  if (!payload) {
    throw new CustomError(status.NOT_FOUND, "Token not found");
  }
  return payload;
};
