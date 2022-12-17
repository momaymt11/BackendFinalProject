const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

global.__basedir = __dirname;
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

require("./app/routes/admin.route")(app);
require("./app/routes/chat.route")(app);
require("./app/routes/mental.route")(app);
require("./app/routes/psy.route")(app);
require("./app/routes/user.route")(app);
require("./app/routes/file.route")(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
