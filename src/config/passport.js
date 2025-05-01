const GoogleStrategy = require("passport-google-oauth20");
const config = require("./config");
const { userService } = require("../services");

const googleStrategyObject = {
  clientID: config.env.googleClientId,
  clientSecret: config.env.googleClientSecret,
  callbackURL: config.env.googleCallbackUrl,
};

const getUserStrategy = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userService.findOrCreateGoogleUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

const serializeUserFunction = (user, done) => {
  done(null, user.id);
};

const deserializeUserFunction = async (id, done) => {
  try {
    const user = await userService.getById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
};

const googleStrategy = new GoogleStrategy(
  googleStrategyObject,
  getUserStrategy
);

module.exports = {
  googleStrategy,
  serializeUserFunction,
  deserializeUserFunction,
};
