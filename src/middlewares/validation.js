const joi = require("joi");
const CustomError = require("../utils/customError");

const validate = (schema) => (req, res, next) => {
  const keys = Object.keys(schema);
  const object = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});
  
  const { error } = joi.compile(schema).validate(object, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => detail.message).join(", ");
    return next(new CustomError(400, errors)); // ✅ return here
  }

  return next(); // ✅ only called if no error
};

module.exports = validate;
