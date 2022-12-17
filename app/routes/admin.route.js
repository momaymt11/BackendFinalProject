module.exports = (app) => {
  const admin_controller = require("../controllers/admin.controller");
  var router = require("express").Router();
  router.post("/adminlogin/auth", admin_controller.login);
  router.post("/admin/user_list", admin_controller.user_list);
  router.post("/admin/user_add", admin_controller.user_add);
  router.post("/admin/user_update", admin_controller.user_update);
  router.post("/admin/user_delete", admin_controller.user_delete);
  router.post("/admin/psy_list", admin_controller.psy_list);
  router.post("/admin/psy_add_account", admin_controller.psy_add_account);
  router.post("/admin/psy_update_account", admin_controller.psy_update_account);
  router.post("/admin/psy_delete", admin_controller.psy_delete);
  router.post("/admin/mental_healt_list", admin_controller.mental_healt_list);
  router.post("/admin/mental_healt_add", admin_controller.mental_healt_add);
  router.post("/admin/mental_healt_edit", admin_controller.mental_healt_edit);
  router.post(
    "/admin/mental_healt_delete",
    //แอดมินลบคำถาม-->ชี้ admin model
    admin_controller.mental_healt_delete
  );
  app.use("/rabfang_api", router);
};
