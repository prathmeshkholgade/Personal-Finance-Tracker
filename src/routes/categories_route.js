const express = require("express");
const {
  renderCategoryScreen,
  renderCategoryCreate,
  createCategory,
  editCategory,
  destoryCategory,
  renderCategoryEditScreen,
} = require("../controllers/categories_controller");
const { verifyUser } = require("../middleware/auth_middleware");

const router = express.Router();

router.get("/", verifyUser, renderCategoryScreen);
router.get("/create", verifyUser, renderCategoryCreate);
router.post("/create", verifyUser, createCategory);
router.put("/edit/:id", verifyUser, editCategory);
router.delete("/:id", verifyUser, destoryCategory);
router.get("/edit/:id", verifyUser, renderCategoryEditScreen);

module.exports = router;
