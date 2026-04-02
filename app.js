require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const db = require("./src/config/db");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const authRoutes = require("./src/routes/auth_route");
const dashboardRoutes = require("./src/routes/dashboard_route");
const cookieParser = require("cookie-parser");
const session = require("express-session");

var flash = require("connect-flash");
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET_KEY,
  }),
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "src", "public")));
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/transaction", (req, res) => {
  return res.render("dashboard/transaction_screen");
});
app.get("/budget", (req, res) => {
  return res.render("dashboard/budget_screen");
});

app.get("/category", (req, res) => {
  return res.render("dashboard/category_screen");
});

app.get("/reports", (req, res) => {
  return res.render("dashboard/reports_screen");
});

app.get("/setting", (req, res) => {
  return res.render("dashboard/setting_screen");
});

app.get("/", (req, res) => {
  res.send("working");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong", stack } = err;
  res.status(status).json({ success: false, message: message, stack });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listing to port ${port}`);
});
