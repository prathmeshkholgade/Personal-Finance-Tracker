require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const db = require("./src/config/db");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const authRoutes = require("./src/routes/auth_route");
const dashboardRoutes = require("./src/routes/dashboard_route");
const categoriesRoutes = require("./src/routes/categories_route");
const transactionsRoutes = require("./src/routes/transaction_route");
const budgetRoutes = require("./src/routes/budget_route");
const reportsRoute = require("./src/routes/report_route");
const profileRoute = require("./src/routes/profile_route");
const reminderRoute = require("./src/routes/reminder_route");

const { User } = require("./src/models");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const flash = require("connect-flash");
app.use(methodOverride("_method"));
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

app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.locals.userName = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: decoded },
    });
    res.locals.userName = user?.fullName || null;
    next();
  } catch (err) {
    next(err);
  }
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/category", categoriesRoutes);
app.use("/transaction", transactionsRoutes);
app.use("/budget", budgetRoutes);
app.use("/report", reportsRoute);
app.use("/profile", profileRoute);
app.use("/reminder", reminderRoute);

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
