const express = require("express");
const {
  renderCategoryScreen,
  renderCategoryCreate,
  createCategory,
} = require("../controllers/categories_controller");
const { verifyUser } = require("../middleware/auth_middleware");

const router = express.Router();

router.get("/",verifyUser, renderCategoryScreen);
router.get("/create", verifyUser, renderCategoryCreate);
router.post("/create", verifyUser, createCategory);

module.exports = router;
