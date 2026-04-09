const express = require("express");
const router = express.Router();

const { User } = require("../models");
const { verifyUser } = require("../middleware/auth_middleware");
const { changePassword, editUserInfo } = require("../controllers/auth_controller");

router.get("/",verifyUser, async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user,
    },
  });
  // res.json({user})
  return res.render("dashboard/setting_screen",{user});
});

router.patch("/change-password", verifyUser, changePassword);
router.patch("/update-profile", verifyUser, editUserInfo);

module.exports = router;
