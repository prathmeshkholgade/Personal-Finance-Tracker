const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken =  (userId) => {
  console.log(process.env.JWT_SECRET_KEY);
  const token =  jwt.sign(userId, process.env.JWT_SECRET_KEY);
  return token;
};

module.exports = { generateToken };
