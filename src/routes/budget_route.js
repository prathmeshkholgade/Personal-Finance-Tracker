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
const router = express.Router();

router.get("/", verifyUser, renderBudgetScreen);

router.get("/create", verifyUser, renderCreateBudgetScreen);

router.post("/create", verifyUser, validateBudget, createBudget);
router.get("/edit/:id", verifyUser, renderEditBudgetScreen);

router.put("/edit/:id", verifyUser, validateBudget, editBudget);

router.delete("/:id", verifyUser, destoryBudget);

module.exports = router;
