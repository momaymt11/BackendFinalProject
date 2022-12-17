module.exports = (app) => {
  const user_controller = require("../controllers/user.controller");
  var router = require("express").Router();
  router.post("/userlogin/auth", user_controller.auth);
  router.post("/userregister/register", user_controller.register);
  router.post("/user/account_settings", user_controller.account_settings);
  router.post("/user/time_appoinntment", user_controller.time_appoinntment);
  router.post("/user/update_account", user_controller.update_account);
  router.get(
    "/user/user_make_an_appointment",
    //ดึงข้อมูลหมอมาให้user
    user_controller.user_make_an_appointment
  );
  router.post(
    //เพิ่มการนัด
    "/user/user_make_an_appointment/add",
    user_controller.user_make_an_appointment_action
  );
  router.post(
    //ดึงข้อมูลนัดให้ user
    "/user/user_my_appointment_book",
    user_controller.user_my_appointment_book
  );
  app.use("/rabfang_api", router);
};
