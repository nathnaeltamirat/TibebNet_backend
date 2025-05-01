const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const validate = require("../middlewares/validation");
const { userValidation } = require("../validators");
const passport = require("passport");

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

// Redirect to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//Google callback Url
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleLoginCallback
);
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: err.message || 'Internal server error' });
});


module.exports = router;
