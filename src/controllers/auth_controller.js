const bcrypt = require("bcrypt");
const { User } = require("../models");
const ExpressError = require("../utils/express_error");
const helper = require("../utils/helper");

module.exports.signupUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return next(new ExpressError(400, "user already exist with this email"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = await helper.generateToken(user.id);
  res.status(200).json({
    success: true,
    message: "register successfully",
    data: {
      token: token,
      user: {
        userName: user.fullName,
        email: user.email,
      },
    },
  });
};
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ExpressError(400, "user not found with this email"));
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ExpressError(400, "invalid credentials"));
  }

  const token = await helper.generateToken(user.id);

  res.status(200).json({
    success: true,
    message: "login successfully",
    data: {
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    },
  });
};
