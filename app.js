const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");


const usersRouter = require("./routes/users");

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/users", usersRouter);
console.log(process.env.NODE_ENV);

app.listen(8080);
