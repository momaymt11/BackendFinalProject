module.exports = (app) => {
  const psy_controller = require("../controllers/psy.controller");
  var router = require("express").Router();
  router.post("/psylogin/auth", psy_controller.auth);
  router.post("/psyregister/register", psy_controller.register);
  router.post("/psy/psy_account_settings", psy_controller.psy_account_settings);
  router.post("/psy/psy_result_mental", psy_controller.psy_result_mental);
  router.post("/psy/psy_update_account", psy_controller.psy_update_account);
  router.post(
    "/psy/psy_visits_appointments",
    psy_controller.psy_visits_appointments
  );
  app.use("/rabfang_api", router);
};
