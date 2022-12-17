const Psy = require("../models/psy.model");
const bcrypt = require("bcryptjs");
//ไลเบอรี่สำหรับดึงข้อมูลform data
const formidable = require("formidable");
var fs = require("fs");

//ดูนัดของหมอ
const psy_visits_appointments = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
  }
  //เพิ่มลิ้งค์รูปของผู้ใช้ไปด้วยว่าตอนนี้ลิ้งค์อะไร
  const baseUrl = req.protocol + "://" + req.headers.host;
  id = req.body.psy_id;
  Psy.psy_visits_appointments(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else {
      for (i in result) {
        result[i].u_image = baseUrl + "/uploads/" + result[i].u_image;
      }
      res.send({ status: true, data: result });
    }
  });
};


//หมอดุแบบประเมิน
const psy_result_mental = (req, res) => {
  Psy.psy_result_mental((err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else res.send({ status: true, data: result });
  });
};

//หมอดูข้อมุลตัวเอง
const psy_account_settings = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
  }
  id = req.body.psy_id;
  const baseUrl = req.protocol + "://" + req.headers.host;
  Psy.psy_account_settings(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else {
      result.psy_image = baseUrl + "/uploads/" + result.psy_image;
      res.send({ status: true, data: result });
    }
  });
};

//หมออัพเดพ
const psy_update_account = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
  }
  //กรณีหมอเปลี่ยนพาสเวิด
  const salt = bcrypt.genSaltSync(10);
  //ที่อยู่ของไฟล์รูปที่หมอจะอัพเพื่อเปลี่ยน
  const uploadDir = __basedir + "/uploads/";

  const form = formidable({ multiples: true });
  //กำหนดไฟล์รูป
  form.maxFileSize = 1024 * 1024 * 20;
  //กำหนดที่อยู่ของไฟล์
  form.uploadDir = uploadDir;
  //แปลงข้อมูลที่หมอให้มาที่หมอต้องการเปลียน
  form.parse(req, (error, fields, files) => {
    data = {
      psy_id: fields.psy_id,
      psy_name: fields.psy_name,
      psy_email: fields.psy_email,
      psy_lang: fields.psy_lang,
    };
    //เปลี่ยนชื่อไฟล์รูปไม่ให้ซ้ำกัน
    if (files.file) {
      const oldpath = files.file.filepath;
      //เอาเวลาปัจจุบัย+ชื่อไฟล์เดิม
      const pic_name = Date.now() + files.file.originalFilename;
      const newpath = uploadDir + pic_name;
      //เปลี่ยนเป้นชื่อใหม่แล้ว
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
      });
      data.psy_image = pic_name;
    }
    //หมอเปลี่ยนรหัสผ่าน
    if (fields.psy_password)
      data.psy_password = bcrypt.hashSync(fields.psy_password, salt);
    Psy.psy_update_account(data, (err, result) => {
      if (err) {
        res.send({ status: false, msg: "error" });
      } else res.send({ status: true, msg: "success" });
    });
  });
};
 //หมอล้อกอิน
const auth = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }

  data = {
    psy_email: req.body.psy_email,
    psy_password: req.body.psy_password,
  };

  Psy.login(data, (err, result) => {
    if (err) {
      if (err.msg == "not_found") {
        res.send({
          status: false,
          msg: "This account does not exist",
        });
      } else if (err.msg == "invalid_pass") {
        res.send({
          status: false,
          msg: "Wrong Password",
        });
      } else {
        res.send({
          status: false,
          msg: "Error! when query.",
        });
      }
    } else res.send({ status: true, data: result, msg: "สำเร็จ" });
  });
};

//หมอสมัครสมาชิก
const register = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //คอมเฟริมรหัสผ่าน
  if (req.body.psy_password != req.body.cpassword) {
    res.send({
      status: false,
      msg: "Password not the same!",
    });
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  //ข้อมุลหมอที่สมัครมาใหม่ ส่งให้ sql
  data = {
    psy_name: req.body.psy_name,
    psy_image: "no_image.jpg",
    psy_email: req.body.psy_email,
    psy_password: bcrypt.hashSync(req.body.psy_password, salt),
    psy_lang: "English",
  };
  Psy.register(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

module.exports = {
  psy_visits_appointments,
  psy_result_mental,
  psy_account_settings,
  psy_update_account,
  auth,
  register,
};
