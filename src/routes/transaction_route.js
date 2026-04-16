const express = require("express");
const {
  renderTransactionScreen,
  renderTransactionCreateScreen,
  createTransaction,
  deleteTransaction,
  editTransaction,
  renderTransactionEditScreen,
} = require("../controllers/transaction_controller");
const { verifyUser } = require("../middleware/auth_middleware");
const wrapAsync = require("../utils/wrap_async");

const router = express.Router();

router.get("/", verifyUser, wrapAsync(renderTransactionScreen));
router.get("/create", verifyUser, wrapAsync(renderTransactionCreateScreen));
router.post("/create", verifyUser, wrapAsync(createTransaction));
router.get("/edit/:id", verifyUser, wrapAsync(renderTransactionEditScreen));
router.put("/edit/:id", verifyUser, wrapAsync(editTransaction));
router.delete("/delete/:id", verifyUser, wrapAsync(deleteTransaction));

module.exports = router;
