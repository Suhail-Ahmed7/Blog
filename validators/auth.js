const { check } = require("express-validator");
const validateEmail = require("./validateEmail");

const signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwors should be 6 character long")
    .notEmpty()
    .withMessage("Password is required"),
];

const siginValidator = [
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),

  check("password").notEmpty().withMessage("Password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),
];

const verifyUser = [
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),

  check("code").notEmpty().withMessage("Code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),

  check("code").notEmpty().withMessage("Code is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwors should be 6 character long")
    .notEmpty()
    .withMessage("Password is required"),
];

const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("Old Password is required."),
  check("newPassword").notEmpty().withMessage("New password is required."),
];

const updateProfileValidator = [
  check("email").custom(async (email) => {
    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        throw "Invalid Email";
      }
    }
  }),
];
module.exports = {
  signupValidator,
  siginValidator,
  emailValidator,
  verifyUser,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
