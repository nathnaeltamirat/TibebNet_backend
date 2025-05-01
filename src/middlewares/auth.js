const CustomError = require("../utils/customError");
const { tokenService, userService } = require("../services");
const { status } = require("http-status");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new CustomError(status.UNAUTHORIZED, "Authenticate token is missing");
  }
  try {
    const payload = await tokenService.verifyToken(token);
    const user = await userService.getUserById(payload.id);
    req.user = user;
    next();
  } catch (err) {
    res
      .status(status.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
