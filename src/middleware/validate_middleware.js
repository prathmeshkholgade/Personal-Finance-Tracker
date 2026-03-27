const ExpressError = require("../utils/express_error");

module.exports = (schema) => {
  return (req, res, next) => {
    let { error, value } = schema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error.details[0].message));
    }
    req.body = value;
    next();
  };
};

// module.exports = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       message: error.details[0].message
//     });
//   }

//   next();
// };
