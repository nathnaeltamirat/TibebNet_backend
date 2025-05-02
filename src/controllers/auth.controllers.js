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
exports.getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(status.OK).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.editUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);
  res.status(status.OK).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.googleLoginCallback = catchAsync(async (req, res) => {
  const user = req.user;
  const token = await tokenService.generateToken(user._id);
  res.status(status.OK).json({ message: "Login successful", user, token });
});
