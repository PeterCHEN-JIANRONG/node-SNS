const jwt = require("jsonwebtoken");
const handleErrorAsync = require("./handleErrorAsync");
const appError = require("./appError");
const User = require("../models/userModel");

// 產生 JWT token 憑證
const generateSendJWT = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_DAY,
    }
  );
  user.password = undefined; // 預防有人誤把密碼帶回去，先移除掉
  res.status(statusCode).json({
    status: "success",
    user: {
      token,
      name: user.name,
    },
  });
};

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
    return next(appError(next, "查無用戶資料", 400));
  }

  req.user = currentUser;
  next();
});

module.exports = {
  generateSendJWT,
  isAuth,
};
