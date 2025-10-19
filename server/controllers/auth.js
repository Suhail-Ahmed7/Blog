const { User } = require("../models/index");
const hashPassword = require("../utils/hashPassword");
const { comparePassword } = require("../utils/comparePassword");
const { genrateToken } = require("../utils/genrateToken");
const { genrateOTP } = require("../utils/genrateOTP");
const { sendEmail } = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      res.code = 400;
      throw new Error("Email already exists ⚠");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "User created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid credentials.");
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      res.code = 401;
      throw new Error("Invalid credentials.");
    }

    const token = genrateToken(user);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Login successfully.",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found.");
    }
    if (user.isVerified === true) {
      res.code = 400;
      throw new Error("User is already verified.");
    }

    const code = genrateOTP(6);
    user.varificationCode = code;
    await user.save();

    // send email
    await sendEmail({
      emaiTo: user.email,
      subject: "Email verification code",
      code,
      content: "verify your account",
    });
    res.status(200).json({
      code: 200,
      status: true,
      message: "User  verification code send successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("User not found👀.");
    }

    if (user.varificationCode != code) {
      res.code = 400;
      throw new Error("Invalid code.");
    }

    user.isVerified = true;
    user.varificationCode = null;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "User verified successfully🙂",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("User not found👀.");
    }

    const code = genrateOTP(6);
    user.forgotPasswordCode = code;
    await user.save();

    await sendEmail({
      emaiTo: user.email,
      subject: "Forgot Password code",
      code,
      content: "Change your password",
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Code sent to given email successfully. ",
    });
  } catch (error) {
    next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found👀.");
      error.status = 400;
      throw error;
    }

    if (user.forgotPasswordCode !== code) {
      const error = new Error("Invalid Code!");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password recovered successfully🙂",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user; // from auth middleware (JWT)

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found.");
    }

    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      res.code = 400;
      throw new Error("Old password doesn't match.");
    }

    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("New password must be different from the old one.");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password changed successfully 🙂",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Request body missing. Ensure Content-Type: application/json",
      });
    }

    const { _id } = req.user;
    const { name, email } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (email) user.isVerified = false;

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile updated successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  verifyCode,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
};
