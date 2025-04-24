const catchAsync = require("../utils/catchAsync");
const { status } = require("http-status");
const { userService } = require("../services");

exports.signUp = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user,
    },
  });
});

