const mysql = require("mysql2");
const dbConfig = require("../configs/db.config");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

connection.connect((error) => {
  if (error) console.log("MYSQL connection: " + error);
  else console.log("Successfully connected to the database.");
});

setInterval(function () {
  connection.ping((err) => {
    if (err) throw err;
  });
}, 30000);

module.exports = connection;
