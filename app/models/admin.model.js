const sql = require("./db.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Admin = function (admin) {
  this.admin_username = admin.admin_username;
  this.admin_password = admin.admin_password;
};

Admin.login = (info, result) => {
  sql.query(
    `SELECT * FROM admin WHERE admin_username = ?`,
    info.admin_username,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compareSync(
          info.admin_password,
          res[0].admin_password
        );
        if (validPassword) {
          result(null, { admin_id: res[0].admin_id, admin_role: "admin" });
        } else {
          result({ msg: "invalid_pass" }, null);
        }
        return;
      }
      result({ msg: "not_found" }, null);
    }
  );
};
//ดึงข้อมูลuser ให้แอดมิน
Admin.user_list = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.user_add = (info, result) => {
  sql.query("INSERT INTO users SET ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.user_update = (info, result) => {
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

Admin.user_delete = (info, result) => {
  sql.query("DELETE FROM users WHERE u_id = ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Admin.psy_list = (result) => {
  sql.query("SELECT * FROM psychiatrist", (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.psy_add_account = (info, result) => {
  sql.query("INSERT INTO psychiatrist SET ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.psy_update_account = (info, result) => {
  sql.query(
    "UPDATE psychiatrist SET ? WHERE psy_id = ?",
    [info, info.psy_id],
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

Admin.psy_delete = (info, result) => {
  sql.query("DELETE FROM psychiatrist WHERE psy_id = ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Admin.mental_healt_list = (result) => {
  sql.query("SELECT * FROM mentalhealth_form", (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.mental_healt_add = (info, result) => {
  sql.query("INSERT INTO mentalhealth_form SET ?", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.mental_healt_edit = (info, result) => {
  sql.query(
    "UPDATE mentalhealth_form SET ? WHERE m_f_id = ?",
    [info, info.m_f_id],
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

Admin.mental_healt_delete = (info, result) => {
  sql.query(
    "DELETE FROM mentalhealth_form WHERE m_f_id = ?",
    info,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ msg: "not_found" }, null);
        return;
      }
      result(null, res);
    }
  );
};

module.exports = Admin;
