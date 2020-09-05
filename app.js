const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("promise-mysql");

const usersRouter = require("./routes/users");
const connecter = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysqlroot",
    database: "dbms",
  });
  let stuff = await connection.query("show tables");
  console.info(stuff.length);
};
connecter();
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/users", usersRouter);
console.log(process.env.NODE_ENV);

app.listen(8080);
