const config = require("../config/config");
const logger = require("../config/logger");
const CustomError = require("../utils/customError");
const { status } = require("http-status");
const mongoose = require("mongoose");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!error instanceof CustomError) {
    const statusCode = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
      ? status.BAD_REQUEST
      : status.INTERNAL_SERVER_ERROR;
    const message = error.message || status[statusCode];
    error = new CustomError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  statusCode = statusCode || status.INTERNAL_SERVER_ERROR;
  message = message || "Internal Server Error";
  if (config.env === "production" && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[statusCode];
  }
  const response = {
    error: true,
    code: statusCode,
    message,
    ...(config.env.nodeEnv === "development" && { stack: err.stack }),
  };
  res.locals.errorMessage = message;
  if (config.env.nodeEnv === "development") {
    logger.error(err);
  }
  res.status(statusCode).send(response);
  next();
};

module.exports = { errorHandler, errorConverter };
