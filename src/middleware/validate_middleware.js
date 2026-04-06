const ExpressError = require("../utils/express_error");
const {
  loginUserSchema,
  userSchema,
} = require("../validation/auth_validation");
const { budgetSchema } = require("../validation/validations");

// module.exports = (schema) => {
//   return (req, res, next) => {
//     let { error, value } = schema.validate(req.body);
//     if (error) {
//       return next(new ExpressError(400, error.details[0].message));
//     }
//     req.body = value;
//     next();
//   };
// };

const validateLogin = (req, res, next) => {
  let { error, value } = loginUserSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/auth/login");
  }
  req.body = value;
  next();
};

const validateSignup = (req, res, next) => {
  let { error, value } = userSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/auth/signup");
  }
  req.body = value;
  next();
};

const validateBudget = (req, res, next) => {
  let { error, value } = budgetSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/budget/create");
  }
  req.body = value;
  next();
};
const validateEditBudget = (req, res, next) => {
  let { error, value } = budgetSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/budget/create");
  }
  req.body = value;
  next();
};

module.exports = {
  validateLogin,
  validateSignup,
  validateBudget,
  validateEditBudget,
};
