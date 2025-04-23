const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler, errorConverter } = require("./middlewares/error");
const { status } = require("http-status");
const CustomError = require("./utils/customError");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Import routes

//error handler middleware
app.use((req, res, next) => {
  new CustomError(status.NOT_FOUND, "Not Found");
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
