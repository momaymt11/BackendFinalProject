const sql = require("./db.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = function (x) {
  this.u_id = x.u_id;
  this.u_image = x.u_image;
  this.u_name = x.u_name;
  this.u_email = x.u_email;
  this.u_password = x.u_password;
  this.u_faculty = x.u_faculty;
  this.u_major = x.u_major;
  this.u_year = x.u_year;
  this.u_phone = x.u_phone;
  this.u_birthday = x.u_birthday;
  this.u_address = x.u_address;
};

User.auth = (info, result) => {
  sql.query(
    `SELECT * FROM users WHERE u_email = ?`,
    info.u_email,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compareSync(
          info.u_password,
          res[0].u_password
        );
        if (validPassword) {
          result(null, { u_id: res[0].u_id, u_role: "user" });
        } else {
          result({ msg: "invalid_pass" }, null);
        }
        return;
      }
      result({ msg: "not_found" }, null);
    }
  );
};

User.register = (info, result) => {
  sql.query("INSERT INTO users SET ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

User.checkIsValue = (info, result) => {
  sql.query(
    `SELECT a_psy_id,REPLACE(TRIM(TIME_FORMAT(TIME(a_date), "%H: %i"))," ", "") as a_time, DATE(a_date) as a_date  FROM appointment  HAVING a_psy_id = ?  AND a_date =  ? AND a_time =  ?`,
    [info.psy_id, info.date, info.time],
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.length > 0) result(null, true);
      else result(null, false);
    }
  );
};

User.user_make_an_appointment = (result) => {
  sql.query("SELECT * FROM psychiatrist", (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    for (i in res) {
      res[i].psy_lang = res[i].psy_lang.split(",");
    }
    result(null, res);
  });
};

User.user_make_an_appointment_action = (info, result) => {
  sql.query("INSERT INTO appointment SET ? ", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
//ดูการนัดของผู้ใช้
User.user_my_appointment_book = (info, result) => {
  sql.query(
    "SELECT *,DATE_FORMAT(a_date, '%W %e %M %Y %H:%i') as a_date_as FROM appointment a JOIN psychiatrist p ON a.a_psy_id = p.psy_id WHERE a_u_id = ? ORDER BY a_date ASC",
    info,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      for (i in res) {
        res[i].a_topic = res[i].a_topic.split(",");
        res[i].psy_lang = res[i].psy_lang.split(",");
      }
      result(null, res);
    }
  );
};

User.account_settings = (info, result) => {
  sql.query("SELECT * FROM users WHERE u_id = ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res[0]);
  });
};

User.update_account = (info, result) => {
  sql.query(
    "UPDATE users SET ? WHERE u_id = ?",
    [info, info.u_id],
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

module.exports = User;
