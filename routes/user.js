var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const appError = require("../services/appError");

// 登入判斷 middleware
const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(appError(next, "你尚未登入！", 401));
  }

  // 驗證 JWT token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        // JWT 解密失敗
        // reject(err); // 直接拋錯給 express 錯誤處理
        return next(appError(next, "你尚未登入！", 401)); // token 無效, 回應尚未登入
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(appError(next, "無用戶資料", 400));
  }

  req.user = currentUser;
  next();
});

// 取得單筆 by Id
// router.get("/user/:id", handleErrorAsync(UserController.getOneById));

// 新增
router.post("/user/", handleErrorAsync(UserController.createOne));

// 刪除單筆 by Id
router.delete("/user/:id", handleErrorAsync(UserController.deleteOneById));

// 更新 by Id
router.patch("/user/:id", handleErrorAsync(UserController.updateOneById));

// 取得全部
router.get("/users/", handleErrorAsync(UserController.getAll));

// 刪除全部
router.delete("/users/", handleErrorAsync(UserController.deleteAll));

// 用戶註冊
router.post("/user/sign_up", handleErrorAsync(UserController.signUp));

// 用戶註冊
router.post("/user/sign_in", handleErrorAsync(UserController.signIn));

// 取得用戶資料, 需驗證 jwt登入
router.get(
  "/user/profile",
  isAuth,
  handleErrorAsync(UserController.getProfile)
);

module.exports = router;
