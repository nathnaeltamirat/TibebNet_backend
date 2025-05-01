const joi = require("joi");
const { password } = require("./custom.validation");
exports.createUserSchema = {
  body: joi.object().keys({
    username: joi.string().required().min(3).max(50).trim(),
    email: joi.string().required().email().trim().lowercase(),
    password: joi.string().required().trim().custom(password),
    role: joi.string().valid("user", "admin").default("user"),
  }),
};
exports.loginUserSchema = {
  body: joi.object().keys({
    email: joi.string().required().email().trim().lowercase(),
    password: joi.string().required().trim(),
  }),
};
