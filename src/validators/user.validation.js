const joi = require("joi");
const { password } = require("./custom.validation");
const createUserSchema = {
  body: joi.object().keys({
    username: joi.string().required().min(3).max(50).trim(),
    email: joi.string().required().email().trim().lowercase(),
    password: joi.string().required().trim().custom(password),
  }),
};

module.exports = createUserSchema;
