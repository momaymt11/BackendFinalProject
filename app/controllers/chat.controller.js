const Chat = require("../models/chat.model");
const bcrypt = require("bcryptjs");

const chat_list = (req, res) => {
  const baseUrl = req.protocol + "://" + req.headers.host;
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  Chat.chat_list(req.body.a_id, (err, result) => {
    if (err) {
      res.send({
        status: false,
        data: [],
      });
      return;
    }
    for (i in result) {
      //เอารูปของผู้ใช้ไปบวกกับuploadเพื่อให้ขึ้นรูป
      result[i].u_image = baseUrl + "/uploads/" + result[i].u_image;
      result[i].psy_image = baseUrl + "/uploads/" + result[i].psy_image;
    }
    res.send({ status: true, data: result });
  });
};

const add_chat = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  data = {
    c_a_id: req.body.c_a_id,
    c_psy_id: req.body.c_psy_id,
    c_text: req.body.c_text,
  };
//เพิ่มแชทของหมอ
  Chat.add_chat(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

//เพิ่มแชทของผู้ใช้
const add_chat_user = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //ดาต้าที่ผู้ใช้ส่งมา
  data = {
    c_a_id: req.body.c_a_id,
    c_u_id: req.body.c_u_id,
    c_text: req.body.c_text,
  };
//modelส่งให้ sql
  Chat.add_chat_user(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};
//จากผู้ใช้ส่งมาให้ฟังก์ชั่นcontroller
module.exports = { chat_list, add_chat, add_chat_user };
