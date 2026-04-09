const express = require("express");
const {
  signupUser,
  loginUser,
  renderSignUpScreen,
  renderLoginScreen,
  changePassword,
  editUserInfo,
} = require("../controllers/auth_controller");
const validate = require("../middleware/validate_middleware");
const {
  userSchema,
  loginUserSchema,
} = require("../validation/auth_validation");
const { verifyUser } = require("../middleware/auth_middleware");
const router = express.Router();

router.post("/signup", validate.validateSignup, signupUser);

router.post("/login", validate.validateLogin, loginUser);

router.get("/signup", renderSignUpScreen);
router.get("/login", renderLoginScreen);



module.exports = router;
