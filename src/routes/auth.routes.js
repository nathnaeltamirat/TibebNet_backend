const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const validate = require("../middlewares/validation");
const { userValidation } = require("../validators");

router.post(
  "/signup",
  validate(userValidation.createUserSchema),
  authController.signUp
);
router.post(
  "/login",
  validate(userValidation.loginUserSchema),
  authController.login
);


module.exports = router;
