const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("promise-mysql");
const ms = require("./ms.json");
const fileUpload = require("express-fileupload");

const usersRouter = require("./routes/users");
console.log("hi");

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
  let stuff = await connection.query(
    "select aid, name, artpict from artwork",
    function (error, results, fields) {
      results = JSON.parse(JSON.stringify(results));
      connection.end();
    }
  );
});

app.get("/api/spec_art", function (req, res) {
  let stuff = connection.query(
    "select aid, name, artpict from artwork where name = " + "",
    function (error, results, fields) {
      results = JSON.parse(JSON.stringify(results));
      connection.end();
    }
  );
});
app.post("/api/add_art", function (req, res) {
  var file = req.files./*inputname*/ uploaded_image;
  var img_name = file.name;
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    file.mv("/images/" + file.name, function (err) {
      if (err) return res.status(500).send(err);
    });
  } else {
    console.log(
      "This format is not allowed , please upload file with '.png' or '.jpg'"
    );
  }
  let stuff = connection.query(
    "insert into artwork values(" + "," + "," + "," + "" + ")",
    function (error, results, fields) {
      results = JSON.parse(JSON.stringify(results));
      connection.end();
    }
  );
});
//add art
app.post("/api/buy_art", function (req, res) {
  let stuff = connection.query(
    "insert into orders values(+" + "," + "," + ")",
    function (error, results, fields) {
      connection.end();
    }
  );
});
//buy art
app.post("/api/manage_art", function (req, res) {
  let stuff = connection.query(
    "update artwork set" + "=" + "where " + "=" + "",
    function (error, results, fields) {
      results = JSON.parse(JSON.stringify(results));
      connection.end();
      //query for modifying shit about art
    }
  );
});

app.post("/test/upload", async (req, res) => {
  let conn = await mysql.createConnection(ms);
  let query = `insert into Artwork SET ?`;
  conn.query(query, req.body);
});
