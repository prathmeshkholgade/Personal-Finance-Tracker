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
const wrapAsync = require("../utils/wrap_async");

const router = express.Router();

router.get("/", verifyUser, wrapAsync(renderCategoryScreen));
router.get("/create", verifyUser, wrapAsync(renderCategoryCreate));
router.post("/create", verifyUser, wrapAsync(createCategory));
router.put("/edit/:id", verifyUser, wrapAsync(editCategory));
router.delete("/:id", verifyUser, wrapAsync(destoryCategory));
router.get("/edit/:id", verifyUser, wrapAsync(renderCategoryEditScreen));

module.exports = router;
