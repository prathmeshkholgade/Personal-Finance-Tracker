require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const db = require("./src/config/db");
const authRoutes = require("./src/routes/auth_route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("working");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ success: false, message: message });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listing to port ${port}`);
});
