const express = require("express");

const {
  renderBudgetScreen,
  renderCreateBudgetScreen,
  createBudget,
  editBudget,
  destoryBudget,
  renderEditBudgetScreen,
} = require("../controllers/budget_controller");
const { verifyUser } = require("../middleware/auth_middleware");
const budget = require("../models/budget");
const { validateBudget } = require("../middleware/validate_middleware");
const {
  renderCategoryEditScreen,
} = require("../controllers/categories_controller");
const wrapAsync = require("../utils/wrap_async");
const router = express.Router();

router.get("/", verifyUser, wrapAsync(renderBudgetScreen));

router.get("/create", verifyUser, wrapAsync(renderCreateBudgetScreen));

router.post("/create", verifyUser, validateBudget, wrapAsync(createBudget));
router.get("/edit/:id", verifyUser, wrapAsync(renderEditBudgetScreen));

router.put("/edit/:id", verifyUser, validateBudget, wrapAsync(editBudget));

router.delete("/:id", verifyUser, wrapAsync(destoryBudget));

module.exports = router;
