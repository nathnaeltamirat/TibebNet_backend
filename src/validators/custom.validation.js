const validator = require("validator");

exports.password = (value, helpers) => {
  if (!validator.isStrongPassword(value)) {
    return helpers.message("Password is not strong enough");
  }
  return value;
};
