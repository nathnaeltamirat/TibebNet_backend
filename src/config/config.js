require("dotenv").config();
const { envValidation } = require("../validators");
const { value: envVars, error } = envValidation.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  env: {
    port: envVars.PORT,
    dbConnection: envVars.DB_CONNECTION,
    nodeEnv: envVars.NODE_ENV,
  },
  jwt:{
    jwtSecret:envVars.JWT_SECRET
  }
};
