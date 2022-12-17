const sql = require("./db.model");
const bcrypt = require("bcryptjs");


const Psychiatrist = function (x) {
  this.psy_id = x.psy_id;
  this.psy_image = x.psy_image;
  this.psy_name = x.psy_name;
  this.psy_email = x.psy_email;
  this.psy_password = x.psy_password;
  this.psy_lang = x.psy_lang;
};
//หมอดูว่ามีนัดอะไรบ้าง
Psychiatrist.psy_visits_appointments = (info, result) => {
  sql.query(
    "SELECT *,DATE_FORMAT(a_date, '%W %e %M %Y %H:%i') as a_date_as FROM appointment a JOIN users u ON a.a_u_id = u.u_id WHERE a_psy_id = ? ORDER BY a_date ASC",
    info,
    (err, res) => {
      if (err) {
        result(err, null);
        console.log("Query Error: " + err);
        return;
      }
      for (i in res) {
        res[i].a_topic = res[i].a_topic.split(",");
      }
      result(null, res);
    }
  );
};

//หมอดึผลการประเมิน
Psychiatrist.psy_result_mental = (result) => {
  sql.query(
    "SELECT *,DATE_FORMAT(m_datetime, '%W %e %M %Y %H:%i') as m_datetime_as,SUM(m_a_q_value) as total FROM mentalhealth m JOIN mentalhealth_ans ans ON m.m_id = ans.m_a_m_id GROUP BY m_id ORDER BY m_datetime DESC",
    (err, res) => {
      if (err) {
        result(err, null);
        console.log("Query Error: " + err);
        return;
      }
      result(null, res);
    }
  );
};

Psychiatrist.psy_account_settings = (info, result) => {
  sql.query("SELECT * FROM psychiatrist WHERE psy_id = ?", info, (err, res) => {
    if (err) {
      result(err, null);
      console.log("Query Error: " + err);
      return;
    }
    for (i in res) {
      res[i].psy_lang = res[i].psy_lang.split(",");
    }
    result(null, res[0]);
  });
};

Psychiatrist.psy_update_account = (info, result) => {
  sql.query(
    "UPDATE psychiatrist SET ? WHERE psy_id = ?",
    [info, info.psy_id],
    (err, res) => {
      if (err) {
        console.log("Query Error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Psychiatrist.login = (info, result) => {
  sql.query(
    "SELECT * FROM psychiatrist WHERE psy_email = ?",
    info.psy_email,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compareSync(
          info.psy_password,
          res[0].psy_password
        );
        if (validPassword) {
          result(null, { psy_id: res[0].psy_id, psy_role: "psy" });
        } else {
          result({ msg: "invalid_pass" }, null);
        }
        return;
      }
      result({ msg: "not_found" }, null);
    }
  );
};

Psychiatrist.register = (info, result) => {
  sql.query("INSERT INTO psychiatrist SET ? ", info, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Psychiatrist;
