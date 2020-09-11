const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("promise-mysql");
const ms = require("./ms.json");
const fileUpload = require("express-fileupload");

const usersRouter = require("./routes/users");
console.log("hi");
/*const connecter = async () => {
  const connection = await mysql.createConnection(ms);
  connection.query("insert into customer set ?",obj, function (error, results, fields) {
    console.log(results);
    results = JSON.parse(JSON.stringify(results));
    console.log(results);
    console.log("hi");
    connection.end();
    });
};

connecter();
*/
const app = express();
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(fileUpload());

app.use("/api/users", usersRouter);
console.log(process.env.NODE_ENV);

app.listen(8080);

app.get("/api/all_art", async function (req, res) {
  const connection = await mysql.createConnection(ms);
  connection.query("select * from Artwork", function (error, results) {
    if (error) console.log(error);
    connection.end();
    res.json(results);
  });
});

app.post("/api/spec_art", async function (req, res) {
  let conn = await mysql.createConnection(ms);
  let query = `select * from Artwork where aid = ${req.body.AID}`;
  conn.query(query, null, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json(error);
    } else res.json(results);
    conn.end();
  });
});

app.post("/api/buy_art", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  var preobj = { AID: req.body.AID, CID: req.body.CID };
  var obj = Object.values(preobj);

  let query = "insert into Orders(AID,CID) value (?,?)";
  connection.query(query, obj, function (error, results) {
    if (error) {
      console.error(error);
      res.status(500).json(error).end();
    } else res.json({ OID: results.insertId });
    connection.end();
  });
});

app.post("/api/manage_art", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  const AID = String(req.body.AID);
  delete req.body.AID;
  let query = `update Artwork set ? where AID = ${AID}`;
  connection.query(query, req.body, function (error, results, fields) {
    if (error) console.log(error);
    res.send("Modifications confirmed");
    //query for modifying shit about art
  });
  connection.end();
});

app.post("/test/upload", async (req, res) => {
  let conn = await mysql.createConnection(ms);
  let query = `insert into Artwork SET ?`;
  conn.query(query, req.body);
});

app.post("/api/sign_up", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  var obj = {
    cid: req.body.cid,
    name: req.body.name,
    address: req.body.address,
  };
  let query = "insert into customer set ?"; //test this
  connection.query(query, obj, function (error, results, fields) {
    if (error) console.log(error);
    else res.send("Successfully Signed up");
    //buy art
  });
  connection.end();
});

app.post("/api/search_art", async function (req, res) {
  let conn = await mysql.createConnection(ms);
  let query = `select name from customer where name like '%${req.body.name}%'`;
  conn.query(query, function (error, results, fields) {
    if (error) console.log(error);
    results = JSON.parse(JSON.stringify(results));
    console.log(results);
    res.json(results);
    conn.end();
  });
});

app.post("/api/add_art", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  let obj = req.body;
  let query = "insert into Artwork set ?";
  connection.query(query, obj, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json(error);
    } else res.sendStatus(200);
    //buy art
  });
  connection.end();
});
