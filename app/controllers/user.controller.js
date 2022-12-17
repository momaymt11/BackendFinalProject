const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
//ใช้จัดก่ารการเปลี่ยนชื่ิอไฟล์
var fs = require("fs");


const auth = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }

  data = {
    u_email: req.body.u_email,
    u_password: req.body.u_password,
  };

  User.auth(data, (err, result) => {
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

const register = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  if (req.body.u_password != req.body.cpassword) {
    res.send({
      status: false,
      msg: "Password not the same!",
    });
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  data = {
    u_name: req.body.u_name,
    u_email: req.body.u_email,
    u_password: bcrypt.hashSync(req.body.u_password, salt),
    u_faculty: req.body.u_faculty,
    u_major: req.body.u_major,
    u_year: req.body.u_year,
    u_phone: req.body.u_phone,
    u_birthday: req.body.u_birthday,
    u_address: req.body.u_address,
    u_image: "no_image.jpg",
  };
  User.register(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};
 
//ดึงเวลานัดที่หมอมี หมอว่างตอนไหนเช็คให้
const time_appoinntment = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  data = {
    psy_id: req.body.psy_id,
    date: req.body.date,
  };
  time = [
    { id: 1, time: "09:00" },
    { id: 2, time: "09:30" },
    { id: 3, time: "10:00" },
    { id: 4, time: "10:30" },
    { id: 5, time: "11:00" },
    { id: 6, time: "11:30" },
    { id: 7, time: "13:00" },
    { id: 8, time: "13:30" },
    { id: 9, time: "14:00" },
    { id: 10, time: "14:30" },
  ];
  b_data = [];
  time.forEach((i) => {
    data.time = i.time;
    //เช็คหมอว่างตอนไหน ถ้าไม่ว่างปุ่มเทาในfrontend
    User.checkIsValue(data, (err, result) => {
      if (err) {
        res.send({ status: false, msg: "error" });
        return;
      }
      //ดันข้อมูลไปไว้ในarrayแล้วส่งให้ผู้ใช้เลือก
      b_data.push({ id: i.id, time: i.time, isValue: result });
      if (time.length == b_data.length)
      //ผู้ใช้เลือกเวลาได้
        res.send({ status: true, data: b_data });
    });
  });
};

//ดึงข้อมูลหมอ ว่ามีหมอคนไหนให้เลือกบ้าง
const user_make_an_appointment = (req, res) => {
  const baseUrl = req.protocol + "://" + req.headers.host;
  //ดึงี่ยชื่อหมอในดาต้าเบส
  User.user_make_an_appointment((err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else {
      for (i in result) {
        result[i].psy_image = baseUrl + "/uploads/" + result[i].psy_image;
      }
      res.send({ status: true, data: result });
    }
  });
};

//ผู้ใช้เลือกนัดหมอ
const user_make_an_appointment_action = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  data = {
    a_u_id: req.body.a_u_id,
    a_psy_id: req.body.a_psy_id,
    a_topic: req.body.a_topic,
    a_date: req.body.a_date,
  };
  User.user_make_an_appointment_action(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

//เข้ามาดูว่าตัวเองนัดหมอคนไหนบ้าง
const user_my_appointment_book = (req, res) => {
  const baseUrl = req.protocol + "://" + req.headers.host;
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  id = req.body.u_id;
  User.user_my_appointment_book(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else {
      for (i in result) {
        result[i].psy_image = baseUrl + "/uploads/" + result[i].psy_image;
      }
      res.send({ status: true, data: result });
    }
  });
};

//ผู้ใช้ดูข้อมุลตัวเอง
const account_settings = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  const baseUrl = req.protocol + "://" + req.headers.host;
  id = req.body.u_id;
  User.account_settings(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else {
      result.u_image = baseUrl + "/uploads/" + result.u_image;
      res.send({ status: true, data: result });
    }
  });
};

const update_account = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const uploadDir = __basedir + "/uploads/";
  //แปลงข้อมูลที่ผู้ใช้กรอกในฟอร์ม
  const form = formidable({ multiples: true });
  form.maxFileSize = 1024 * 1024 * 20;
  form.uploadDir = uploadDir;

  form.parse(req, (error, fields, files) => {
    data = {
      u_id: fields.u_id,
      u_name: fields.u_name,
      u_email: fields.u_email,
      u_faculty: fields.u_faculty,
      u_major: fields.u_major,
      u_year: fields.u_year,
      u_phone: fields.u_phone,
      u_birthday: fields.u_birthday,
      u_address: fields.u_address,
    };
    if (files.file) {
      const oldpath = files.file.filepath;
      const pic_name = Date.now() + files.file.originalFilename;
      const newpath = uploadDir + pic_name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
      });
      data.u_image = pic_name;
    }
    if (fields.u_password)
      data.u_password = bcrypt.hashSync(fields.u_password, salt);
    User.update_account(data, (err, result) => {
      if (err) {
        res.send({ status: false, msg: "error" });
      } else res.send({ status: true, msg: "success" });
    });
  });
};

module.exports = {
  auth,
  register,
  time_appoinntment,
  user_make_an_appointment,
  user_make_an_appointment_action,
  user_my_appointment_book,
  update_account,
  account_settings,
};
