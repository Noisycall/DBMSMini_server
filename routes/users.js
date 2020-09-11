var express = require("express");
var router = express.Router();
const ms = require("../ms.json");
const mysql = require("promise-mysql");
/* GET users listing. */
router.post("/create", async function (req, res) {
  let body = req.body;
  console.info(req.body);
  if (body.fname && body.address) {
    try {
      const conn = await mysql.createConnection(ms);
      let query = `select addUser(?,?);`;
      let result = await conn.query(query, [
        body.fname + " " + body.lname,
        body.address,
      ]);
      console.info(result);
      res.status(200).json(Object.values(result[0]));
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal", body: e });
    }
  } else {
    res.status(400).json({ message: "some details were not sent" });
  }
});

module.exports = router;
