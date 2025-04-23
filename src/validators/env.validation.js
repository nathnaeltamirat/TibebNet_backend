const Joi = require("joi");

const envSchema = Joi.object({
  PORT: Joi.number().positive().default(3000),
  DB_CONNECTION: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
}).unknown();

module.exports = envSchema;
