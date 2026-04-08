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

const router = express.Router();

router.get("/", verifyUser, renderTransactionScreen);

router.get("/create", verifyUser, renderTransactionCreateScreen);

router.post("/create", verifyUser, createTransaction);
router.get("/edit/:id", verifyUser, renderTransactionEditScreen);
router.put("/edit/:id", verifyUser, editTransaction);


router.delete("/delete/:id", verifyUser, deleteTransaction);

module.exports = router;
