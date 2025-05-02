const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler, errorConverter } = require("./middlewares/error");
const { status } = require("http-status");
const CustomError = require("./utils/customError");
const morgan = require("./config/morgan");
const authRouter = require("./routes/auth.routes");

const communityRouter = require("./routes/community.routes");


const {
  googleStrategy,
  serializeUserFunction,
  deserializeUserFunction,
} = require("./config/passport");
const passport = require("passport");
app.use(cors());

app.use(express.json());
app.use(cookieParser());
//logger middleware
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use("/api/communities", communityRouter);

//passport middleware


app.use(passport.initialize());

passport.use(googleStrategy);
passport.serializeUser(serializeUserFunction);
passport.deserializeUser(deserializeUserFunction);

app.use("/api/auth", authRouter);

//error handler middleware
app.use((req, res, next) => {
  new CustomError(status.NOT_FOUND, "Not Found");
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
