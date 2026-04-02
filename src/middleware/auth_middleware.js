const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error", "Login first");
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    res.clearCookie("token");
    req.flash("error", "Session expired, login again");

    return res.redirect("/auth/login");
  }
};

module.exports = { verifyUser };
