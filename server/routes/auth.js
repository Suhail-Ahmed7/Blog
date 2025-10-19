const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/index");
const {
  signupValidator,
  siginValidator,
  emailValidator,
  verifyUser,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require("../validators/auth");
const validate = require("../validators/validate");

const { recoverPassword } = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

router.post("/signup", signupValidator, validate, authController.signup);

router.post("/signin", siginValidator, validate, authController.signin);

router.post(
  "/send-verification-email",
  emailValidator,
  validate,
  authController.verifyCode
);

router.post("/verify-user", verifyUser, validate, authController.verifyUser);

router.post(
  "/forgot-password-code",
  emailValidator,
  validate,
  authController.forgotPasswordCode
);

router.post(
  "/recover-password",
  recoverPasswordValidator,
  validate,
  authController.recoverPassword
);

router.put(
  "/change-password",
  changePasswordValidator,
  validate,
  isAuth,
  authController.changePassword
);

router.put(
  "/update-profile",
  isAuth,
  updateProfileValidator,
  validate,
  authController.updateProfile
);
module.exports = router;
