const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("promise-mysql");
const ms = require("./ms.json");
const bodyParser=require("body-parser");
const fileUpload = require('express-fileupload');


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

app.use("/users", usersRouter);
console.log(process.env.NODE_ENV);

app.listen(8080);

app.get("/api/all_art", async function (req, res) {
  const connection = await mysql.createConnection(ms);
  connection.query(
    "select aid, name, artpict from artwork",
    function (error, results, fields) {
      if(error)console.log(error);
      results = JSON.parse(JSON.stringify(results));
      res.send(results);
      connection.end();
    }
  );
});

app.get("/api/spec_art", async function (req, res) {
  let conn = await mysql.createConnection(ms);
  let query = "select aid, name, artpict from artwork where aid = ?"
  conn.query(query, req.body.specartid,
      function (error, results, fields) {
      if(error)console.log(error);
      results = JSON.parse(JSON.stringify(results));
      res.send(results);
      conn.end();
    }
  );
});

app.post("/api/buy_art", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  var obj = {oid: req.body.oid, cid: req.body.cid, aid: req.body.cid};
  let query = "insert into orders set ?";
  connection.query(query,obj,function (error, results, fields) {
   if(error)console.log(error);
   res.send("Order confirmed");
    //buy art   
  }
  );
  connection.end();
});

app.post("/api/manage_art", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  var obj = {oid: req.body.oid, cid: req.body.cid, aid: req.body.cid};
  let query = "update artwork set ? = ? where ? = ?";
  connection.query(query,req.body,
    function (error, results, fields) {
      if(error)console.log(error);
      res.send("Modifications confirmed"); 
      //query for modifying shit about art
    }
  );
  connection.end();
});

app.post("/test/upload", async (req, res) => {
  let conn = await mysql.createConnection(ms);
  let query = `insert into Artwork SET ?`;
  conn.query(query, req.body);
});

app.post("/api/sign_up", async function (req, res) {
  let connection = await mysql.createConnection(ms);
  var obj = {name: req.body.cname, address: req.body.address};
  let query = "insert into customer(name, address) set ?";//test this
  connection.query(query,obj,function (error, results, fields) {
   if(error)console.log(error);
   res.send("Successfully Signed up");
    //buy art   
  }
  );
  connection.end();
});

app.get("/api/search_art", async function (req, res) {
  let conn = await mysql.createConnection(ms);
  let query = `select name from customer where name like '%${req.body.name}%'`
  conn.query(query,
      function (error, results, fields) {
      if(error)console.log(error);
      results = JSON.parse(JSON.stringify(results));
      console.log(results);
      res.json(results);
      conn.end();
    }
  );
});