const bcrypt = require("bcrypt");
const { User } = require("../models");
const ExpressError = require("../utils/express_error");
const helper = require("../utils/helper");

const { Op } = require("sequelize");

module.exports.signupUser = async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;
  const condition = [];

  if (email) condition.push({ email });
  if (phone) condition.push({ phone });

  const existingUser = await User.findOne({
    where: {
      [Op.or]: condition,
    },
  });
  if (existingUser) {
    // return next(new ExpressError(400, "user already exist with this email"));
    req.flash("error", "user already exist with this email or phone");
    return res.redirect("/auth/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
  });

  const token = helper.generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });
  req.flash("success", "user register successsfully");

  // res.locals.userName = fullName;

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
  console.log(isMatch);
  if (!isMatch) {
    req.flash("error", "invalid credentials");
    return res.redirect("/auth/login");
  }
  const token = helper.generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });



  req.flash("success", "user login successsfully");

  return res.redirect("/dashboard");
};

// module.exports.getUser = async (req, res) => {

//   return res.redirect
// };

module.exports.renderSignUpScreen = (req, res) => {
  return res.render("auth/signup_screen");
};

module.exports.renderLoginScreen = (req, res) => {
  return res.render("auth/login_screen");
};

module.exports.editUserInfo = async (req, res) => {
  const { fullName, phone } = req.body;
  const userId = req.user;

  const user = await User.findByPk(userId);

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/profile");
  }

  await User.update({ fullName, phone }, { where: { id: userId } });

  req.flash("success", "Profile updated successfully");
  return res.redirect("/profile");
};

module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user;

  const user = await User.findByPk(userId);

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/profile");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    req.flash("error", "Incorrect current password");
    return res.redirect("/profile");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.update({ password: hashedPassword }, { where: { id: userId } });

  req.flash("success", "Password changed successfully");
  return res.redirect("/profile");
};
