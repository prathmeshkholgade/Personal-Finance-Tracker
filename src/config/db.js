const db = require("../models");

db.sequelize
  .authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(`DB ERROR ${err}`));
