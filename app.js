const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // 跨網域設定 cors
const axios = require("axios");
const { errorHandle, successHandle } = require("./services/httpHandle");

// router
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const usersRouter = require("./routes/users");

// 程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaught Exception!");
  console.error(err);
  process.exit(1); // 停掉 process, 程式終止
});

// 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", err); // 記錄於 log 上
});

const app = express();

// Database 資料庫連線
require("./connections");

app.use(cors()); // 啟用 cors 跨網域設定
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/users", usersRouter);

// 404 not found 錯誤
app.use((req, res, next) => {
  errorHandle(res, "無此路由資訊", 404);
});

// express 錯誤處理
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  errorHandle(res, err, statusCode);
});

module.exports = app;
