module.exports = (app) => {
  const mental_controller = require("../controllers/mental.controller");
  var router = require("express").Router();
  router.post("/question", mental_controller.question);
  router.post("/add_form", mental_controller.add_form);
  app.use("/rabfang_api/mentalhealth", router);
};
