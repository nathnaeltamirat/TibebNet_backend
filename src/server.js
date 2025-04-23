const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const httpServer = http.createServer(app);
const config = require("./config/config");
const logger = require("./config/logger");

mongoose
  .connect(config.env.dbConnection)
  .then(() => {
    logger.info("MongoDB connected");
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err.message);
  });
const server = httpServer.listen(config.env.port, () => {
  logger.info(`Server is running on port ${config.env.port}`);
});
