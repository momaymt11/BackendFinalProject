module.exports = (app) => {
  const chat_controller = require("../controllers/chat.controller");
  var router = require("express").Router();
  router.post("/chat_list", chat_controller.chat_list);
  router.post("/add_chat", chat_controller.add_chat);
  router.post("/add_chat_user", chat_controller.add_chat_user);
  app.use("/rabfang_api/chat", router);
};
