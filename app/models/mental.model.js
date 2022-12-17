const sql = require("./db.model");
const bcrypt = require("bcryptjs");

const MentalHealth = function (x) {
  this.m_id = x.m_id;
  this.m_name = x.m_name;
  this.m_email = x.m_email;
  this.m_datetime = x.m_datetime;
};

MentalHealth.question = (result) => {
  sql.query("SELECT * FROM mentalhealth_form", (err, res) => {
    if (err) {
      console.log("Query Error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

MentalHealth.add_form = (info, result) => {
  sql.query(
    "INSERT INTO mentalhealth SET m_name = ? ,  m_email = ?",
    [info.m_name, info.m_email],
    (err, res) => {
      if (err) {
        console.log("Query Error: " + err);
        result(err, null);
        return;
      }
      id = res.insertId;
      total = 0;
      tosql = [];
      info.answer = JSON.parse(info.answer);
      for (i in info.answer) {
        total += parseInt(info.answer[i].value);
        tosql.push([id, info.answer[i].id, info.answer[i].value]);
      }
      
      sql.query(
        "INSERT INTO mentalhealth_ans (m_a_m_id , m_a_q_id , m_a_q_value) VALUES ?",
        [tosql]
      );
      testResult = "";
      if (total <= 23) {
        testResult =
          "You have a low level of stress and it disappears in a short period of time. It is a stress that occurs in everyday life and is able to adapt to various situations appropriately. This level of stress is considered useful in daily life. It is the motivation that leads to success in life.";
      } else if (total <= 41) {
        testResult =
          "Do you experience moderate stress in your daily life due to threats or stressful event may feel anxious or scared considered normal This level of stress is neither harmful nor harmful to life. You can relieve stress by doing energetic activities such as exercising, playing sports, doing fun things like listening to music, reading, doing hobbies, or having a conversation with someone you trust.";
      } else if (total <= 61) {
        testResult =
          "You have a high level of stress. It is the degree to which you get annoyed by things or events around you, causing anxiety, fear, conflict, or being in a situation that is resolved. can't handle that problem Difficulty adjusting feelings will affect daily life. and illnesses such as high blood pressure stomach ulcers, etc. What you need to do when you are stressed at this level is: Relieve stress in a simple but effective way is breathing exercises, stress relief, and discussions to relieve stress with trusted people. Find the cause or problem that is stressful and find a solution. If you are unable to manage stress on your own Should consult with consultants in various agencies.";
      } else {
        testResult =
          "You have severe stress. It is an ongoing high level of stress or you are facing a life crisis, such as a serious illness. Chronic disability, loss of loved ones, property or loved ones, this level of stress can lead to physical and mental illness. unhappy life highs bad decision can't restrain the mood This level of stress, if left unattended, can be detrimental to both yourself and those close to you and should be assisted quickly by a counselor, such as by phone or a local counselor.";
      }
      result(null, testResult);
    }
  );
};

module.exports = MentalHealth;
