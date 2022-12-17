const sql = require("./db.model");
const bcrypt = require("bcryptjs");

//construture
const Chat = function (x) {
  this.c_id = x.c_id;
  this.c_a_id = x.c_a_id;
  this.c_u_id = x.c_u_id;
  this.c_psy_id = x.c_psy_id;
  this.c_text = x.c_text;
  this.c_datetime = x.c_datetime;
};

Chat.chat_list = (info, result) => {
  sql.query(
    "SELECT c_id,c_text,DATE_FORMAT(c_datetime, '%e %M %Y %H:%i') as c_datetime_as,c_datetime,u_name,u_image,psy_name,psy_image, IF(c_u_id, 'YES', 'NO') as user_chat_act,IF(c_psy_id, 'YES', 'NO') as psy_chat_act, IF(c_u_id, 'USER', 'PSY') as role FROM chat c LEFT OUTER JOIN users u ON c.c_u_id = u.u_id LEFT OUTER JOIN psychiatrist p ON c.c_psy_id = p.psy_id WHERE c_a_id = ? ORDER BY c_datetime ASC",
    //idนัด
    info,
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

Chat.add_chat = (info, result) => {
  sql.query("INSERT INTO chat SET ? ", info, (err, res) => {
    if (err) {
      console.log("Query Error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Chat.add_chat_user = (info, result) => {
  sql.query("INSERT INTO chat SET ? ", info, (err, res) => {
    if (err) {
      console.log("Query Error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Chat;
