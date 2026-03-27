const express = require("express");
const {
  signupUser,
  loginUser,
  renderSignUpScreen,
  renderLoginScreen,
} = require("../controllers/auth_controller");
const validate = require("../middleware/validate_middleware");
const {
  userSchema,
  loginUserSchema,
} = require("../validation/auth_validation");
const router = express.Router();

router.post("/signup", validate(userSchema), signupUser);

router.post("/login", validate(loginUserSchema), loginUser);

router.get("/signup", renderSignUpScreen);
router.get("/login", renderLoginScreen);

module.exports = router;
