const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // 跨網域設定 cors
const { errorHandle, successHandle } = require("./services/httpHandle");

// router
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const usersRouter = require("./routes/users");

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

// 404 not found
app.use((req, res, next) => {
  errorHandle(res, "無此路由資訊", 404);
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.log("Internal Server Error");
  res.status(500).send({
    status: false,
    err,
  });
});

module.exports = app;
