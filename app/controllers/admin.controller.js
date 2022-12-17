const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

const login = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }

  admin = {
    admin_username: req.body.admin_username,
    admin_password: req.body.admin_password,
  };

  Admin.login(admin, (err, result) => {
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
 //ดึงผู้ใช้
const user_list = (req, res) => {
  //ดึงจากลิ้งค์เวลาdeployแล้วเอาลิ้งค์นี้ไปรวมกับชื่อรูป
  const baseUrl = req.protocol + "://" + req.headers.host;
  Admin.user_list((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Error! when query.",
      });
      return;
    }
    for (i in result) {
      //เพื่อขึ้นรูปได้
      result[i].u_image = baseUrl + "/uploads/" + result[i].u_image;
    }
    res.send({ status: true, data: result });
  });
};

const user_add = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //ไว้ใส่รหัสpassของผู้ใช้เพื่อเช็ค(saltสำหรับ hash)
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
  Admin.user_add(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

const user_update = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //ไว้ใส่รหัสpassของผู้ใช้เพื่อเช็ค(saltสำหรับ hash)10 คือความยาวรหัส
  const salt = bcrypt.genSaltSync(10);
  data = {
    u_id: req.body.u_id,
    u_name: req.body.u_name,
    u_email: req.body.u_email,
    u_faculty: req.body.u_faculty,
    u_major: req.body.u_major,
    u_year: req.body.u_year,
    u_phone: req.body.u_phone,
    u_birthday: req.body.u_birthday,
    u_address: req.body.u_address,
  };
  if (req.body.password)
  //กรณีเปลี่ยนแปลงรหัสให้ยูเซอ รหัสจะถูกกอัพเดทในข้อมูลยูสเซอ
    data.u_password = bcrypt.hashSync(req.body.u_password, salt);
  Admin.user_update(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};
//ปุ่มลบuser
const user_delete = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  id = req.body.u_id;
  Admin.user_delete(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else res.send({ status: true, data: [] });
  });
};
//การจัดการข้อมูลหมอ
const psy_list = (req, res) => {
  const baseUrl = req.protocol + "://" + req.headers.host;
  Admin.psy_list((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Error! when query.",
      });
      return;
    }
    for (i in result) {
      result[i].psy_image = baseUrl + "/uploads/" + result[i].psy_image;
    }
    res.send({ status: true, data: result });
  });
};

//แอดมินจัดการเพิ่มหมอ
const psy_add_account = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //hash รหัสหมอในข้อมูลหมอ
  const salt = bcrypt.genSaltSync(10);
  data = {
    psy_name: req.body.psy_name,
    psy_image: "no_image.jpg",
    psy_email: req.body.psy_email,
    psy_password: bcrypt.hashSync(req.body.password, salt),
    psy_lang: req.body.psy_lang,
  };
  //แอดมินจัดการเอาข้อมูลที่ผู้ใช้ส่งมาไปใส่ในsql
  Admin.psy_add_account(data, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else res.send({ status: true, data: [] });
  });
};

const psy_update_account = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  
  const salt = bcrypt.genSaltSync(10);
  data = {
    psy_id: req.body.psy_id,
    psy_name: req.body.psy_name,
    psy_email: req.body.psy_email,
    psy_lang: req.body.psy_lang,
  };
  if (req.body.password)
    data.psy_password = bcrypt.hashSync(req.body.u_password, salt);
  Admin.psy_update_account(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

//สำหรับปุ่มลบข้อมูลหมอ
const psy_delete = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  id = req.body.psy_id;
  Admin.psy_delete(id, (err, result) => {
    if (err) {
      res.send({ status: false, data: [] });
    } else res.send({ status: true, data: [] });
  });
};

//หมอจัดการแบบประเมินสุขภาพ
const mental_healt_list = (req, res) => {
  Admin.mental_healt_list((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Error! when query.",
      });
      return;
    }
    res.send({ status: true, data: result });
  });
};

const mental_healt_add = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  //ดึงคำถามที่แอดมินเพิ่มไปใส่ในsql
  m_f_question = req.body.m_f_question;
  Admin.mental_healt_add({ m_f_question: m_f_question }, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};
 
const mental_healt_edit = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  data = {
    m_f_id: req.body.m_f_id,
    m_f_question: req.body.m_f_question,
  };
  //โมเดลแอดมินส่งdata in sql
  Admin.mental_healt_edit(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};

const mental_healt_delete = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need Body!",
    });
    return;
  }
  Admin.mental_healt_delete(req.body.m_f_id, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success" });
  });
};


//ตัวแปรสำหรับฟังก์ชันที่controllerส่งไป
module.exports = {
  login,
  user_list,
  user_add,
  user_update,
  user_delete,
  psy_list,
  psy_add_account,
  psy_update_account,
  psy_delete,
  mental_healt_list,
  mental_healt_add,
  mental_healt_edit,
  mental_healt_delete,
};
