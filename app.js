require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const db = require("./src/config/db");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const authRoutes = require("./src/routes/auth_route");
const session = require("express-session");
f;
var flash = require("connect-flash");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "src", "public")));

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
