const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const config = require("./config");

morgan.token("message", (req, res) => res.locals.errorMessage || "");

const getIPFormat = () =>
  config.env.nodeEnv === "production" ? ":remote-addr" : "";

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});

const successHandlerFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
const errorHandlerFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date - error-message :message `;

const successHandler = morgan(successHandlerFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode >= 400,
});
const errorHandler = morgan(errorHandlerFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400,
});

module.exports = { successHandler, errorHandler };
