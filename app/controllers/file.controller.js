//ฟังค์ชั่นสำหรับดูไฟท์รูป
const getfile = (req, res) => {
  const fileName = req.params.name;
  //สำหรับดึงไฟล์รูปให้user
  const directoryPath = __basedir + "/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        status: false,
        msg: "Could not download the file." + err,
      });
    }
  });
};

module.exports = { getfile };
