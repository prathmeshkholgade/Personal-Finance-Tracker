const joi = require("joi");

const userSchema = joi.object({
  fullName: joi.string().max(40).required(),
  email: joi.string().email().required(),
  phone: joi.string().pattern(/^[0-9]{10}$/),
  password: joi.string().min(6).required(),
});
const loginUserSchema = joi.object({
  email: joi.string().email().required(),
  phone: joi.string().pattern(/^[0-9]{10}$/),
  password: joi.string().min(6).required(),
});

module.exports = { userSchema, loginUserSchema };
