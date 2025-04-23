const winston = require("winston");
const { format, createLogger, transports } = winston;
const { printf, combine, timestamp, colorize, uncolorize } = format;
const config = require("./config");

const winstonFormat = printf(({ level, timestamp, message, stack }) => {
  return `${timestamp} : ${level} : ${stack || message}`;
});

const logger = createLogger({
  level: config.env.nodeEnv === "development" ? "debug" : "info",
  format: combine(
    timestamp(),
    winstonFormat,
    config.env.nodeEnv === "development" ? colorize() : uncolorize()
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
