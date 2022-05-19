const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // 跨網域設定 cors
const axios = require("axios");
const { errorHandle } = require("./services/httpHandle");
const { resErrorDev, resErrorProd } = require("./services/resErrorHandle");

// router
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

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

// 路由
app.use("/", indexRouter);
app.use("/", postRouter); // post
app.use("/", userRouter); // user

// 404 not found 錯誤
app.use((req, res, next) => {
  errorHandle(res, "無此路由資訊", 404);
});

// express 錯誤處理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  // production
  // 可預期的 NPM 錯誤
  if (err.name === "ValidationError") {
    // 欄位未輸入、格式錯誤
    const fields = Object.keys(err.errors);
    err.message = `資料欄位 ${fields} 未填寫正確，請重新輸入！`;
    err.isOperational = true;
    err.statusCode = 400;
    return resErrorProd(err, res);
  } else if (err.name === "SyntaxError") {
    // JSON 解析錯誤
    err.message = "資料格式未填寫正卻，請重新輸入！";
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    // mongoose 錯誤： field 資料重覆, 例如: email
    const field = Object.keys(err.keyValue);
    err.message = `${field} 資料重覆，請重新輸入！`;
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === "CastError" && err.kind === "ObjectId") {
    // ObjectId 格式錯誤
    err.message = "ID格式錯誤，請重新輸入！";
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  // 非預期的 NPM 錯誤
  resErrorProd(err, res);
});

module.exports = app;
