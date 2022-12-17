module.exports = (app) => {
  const file_controller = require("../controllers/file.controller");
  var router = require("express").Router();
  router.get("/:name", file_controller.getfile);
  app.use("/uploads", router);
};
