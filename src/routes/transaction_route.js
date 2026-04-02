const express = require("express");
const {
  renderTransactionScreen,
  renderTransactionCreateScreen,
  createTransaction,
} = require("../controllers/transaction_controller");
const { verifyUser } = require("../middleware/auth_middleware");

const router = express.Router();

router.get("/", renderTransactionScreen);

router.get("/create",verifyUser, renderTransactionCreateScreen);

router.post("/create",verifyUser, createTransaction);

module.exports = router;
