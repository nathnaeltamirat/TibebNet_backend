const catchAsync = require("../utils/catchAsync");
const { status } = require("http-status");
const { userService, tokenService } = require("../services");

exports.signUp = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const payload = {
    id: user.id,
    role: user.role,
  };
  const token = await tokenService.generateToken(payload);
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.loginUser(email, password);
    const payload = {
        id: user.id,
        role: user.role,
    };
    const token = await tokenService.generateToken(payload);
    res.status(status.OK).json({
        status: "success",
        data: {
            user,
            token,
        },
    });
});
