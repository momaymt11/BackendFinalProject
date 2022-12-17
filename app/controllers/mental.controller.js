const Mental = require("../models/mental.model");
//ดึงคำถามในsql
const question = (req, res) => {
  Mental.question((err, result) => {
    if (err) {
      res.send({
        status: false,
        data: [],
      });
      return;
    }
    //[]สำหรับดึงคำถามเท่านั้น
    data = [];
    for (i in result) {
      //แสดงข้อคำถาม
      const key = parseInt(i) + 1;
      data.push({
        id: key,
        title: result[i].m_f_question,
        choice: [
          {
            qname: result[i].m_f_id,
            choicevalue: [
              //setช้อยแล้วคำหนดค่าคะแนน
              { name: "Nope", value: 1 },
              { name: "Sometime", value: 2 },
              { name: "Often", value: 3 },
              { name: "Regularly", value: 4 },
              { name: "Most Regularly", value: 5 },
            ],
          },
        ],
      });
    }
    res.send({
      status: true,
      data: data,
    });
  });
};
//คนใช้ตอบคำถาม
const add_form = (req, res) => {
  if (!req.body) {
    res.send({
      status: false,
      msg: "Need body",
    });
    return;
  }
  data = {
    m_name: req.body.name,
    m_email: req.body.email,
    answer: req.body.answer,
  };
  //modelในsql
  Mental.add_form(data, (err, result) => {
    if (err) {
      res.send({ status: false, msg: "error" });
    } else res.send({ status: true, msg: "success", resulttest: result });
  });
};

module.exports = { question, add_form };
