var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // 跨網域設定 cors

// router
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");

var app = express();

// Database 資料庫連線
require("./connections");

app.use(cors()); // 啟用 cors 跨網域設定
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/posts", postsRouter);

module.exports = app;
