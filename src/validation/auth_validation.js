const joi = require("joi");

const userSchema = joi.object({
  fullName: joi.string().max(40).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
const loginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = { userSchema, loginUserSchema };
