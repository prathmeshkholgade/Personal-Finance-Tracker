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
    // return next(new ExpressError(400, "user already exist with this email"));
    req.flash("error", "user already exist with this email");
    return res.redirect("/auth/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = await helper.generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });
  req.flash("success", "user register successsfully");

  return res.redirect("/dashboard");
};
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    req.flash("error", "User not found with this email");
    return res.redirect("/auth/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.flash("error", "invalid credentials");
    return res.redirect("/auth/login");
  }
  const token = await helper.generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });
  req.flash("success", "user login successsfully");

  return res.redirect("/dashboard");
};

module.exports.renderSignUpScreen = (req, res) => {
  return res.render("auth/signup_screen");
};

module.exports.renderLoginScreen = (req, res) => {
  return res.render("auth/login_screen");
};
