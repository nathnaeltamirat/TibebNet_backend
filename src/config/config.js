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
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: envVars.GOOGLE_CALLBACK_URL,
  },
  jwt: {
    jwtSecret: envVars.JWT_SECRET,
  },
};
