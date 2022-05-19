const { successHandle } = require("../services/httpHandle");
const User = require("../models/userModel");
const appError = require("../services/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token 憑證
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

// User controller
const controller = {
  async getOneById(req, res, next) {
    const { id } = req.params;
    const item = await User.findById(id);
    if (item !== null) {
      successHandle(res, item);
    } else {
      return appError(next, "查無此 ID"); // 查無 id
    }
  },
  async getAll(req, res, next) {
    const allItems = await User.find();
    successHandle(res, allItems);
  },
  async createOne(req, res, next) {
    const { name, email, photo, sex, password } = req.body;

    // 前端阻擋 - 欄位格式不正確
    if (!name) {
      return appError(next, "姓名未填寫");
    } else if (!email) {
      return appError(next, "信箱未填寫");
      // } else if (!sex) {
      //   return appError(next, "性別未填寫");
      // } else if (!["male", "female"].includes(sex)) {
      //   return appError(next, `性別欄位錯誤，須為 'male' 或 'female'`);
    } else if (!password) {
      return appError(next, "請輸入密碼");
    } else if (password.length < 8) {
      return appError(next, "密碼最少 8 碼");
    } else {
      // 新增資料
      const data = {
        name,
        email,
        photo,
        sex,
        password,
      };
      const newItem = await User.create(data);
      successHandle(res, newItem);
    }
  },
  async deleteAll(req, res, next) {
    await User.deleteMany({});
    const allItems = await User.find();
    successHandle(res, allItems);
  },
  async deleteOneById(req, res, next) {
    const { id } = req.params;
    const deleteItem = await User.findByIdAndDelete(id);
    if (deleteItem !== null) {
      successHandle(res, deleteItem); // 單筆刪除成功
    } else {
      return appError(next, "查無此 ID");
    }
  },
  async updateOneById(req, res, next) {
    const { name, email, photo, sex, password } = req.body;
    const { id } = req.params;
    const data = {
      name,
      email,
      photo,
      sex,
      password,
    };
    const options = {
      new: true, // 回傳更新"後"的資料, default: false 回傳更新"前"的資料
      runValidators: true, // 驗證修改資料
    };
    const editItem = await User.findByIdAndUpdate(id, data, options);

    if (editItem !== null) {
      successHandle(res, editItem); // 修改成功
    } else {
      return appError(next, "查無此 ID");
    }
  },
  async signUp(req, res, next) {
    const { name, email, password, confirmPassword, photo, sex } = req.body;
    // 內容不可為空
    if (!name) {
      return appError(next, "姓名未填寫", 400);
    } else if (!email) {
      return appError(next, "Email 未填寫", 400);
    } else if (!password) {
      return appError(next, "密碼未填寫", 400);
    } else if (!confirmPassword) {
      return appError(next, "確認密碼未填寫", 400);
    }
    // 密碼正確
    if (password !== confirmPassword) {
      return appError(next, "密碼不一致！", 400);
    }
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return appError(next, "密碼字數低於 8 碼", 400);
    }
    // Email 驗證
    if (!validator.isEmail(email)) {
      return appError(next, "Email 格式不正確", 400);
    }

    const bcryptPassword = await bcrypt.hash(password, 12); // 密碼加密
    const data = {
      name,
      email,
      password: bcryptPassword,
      photo,
      sex,
    };
    const newUser = await User.create(data);
    // 產生 JWT 憑證, 201: 請求成功 & 有新的資源被建立(ex: 用戶)
    generateSendJWT(newUser, 201, res);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(next, "帳號密碼不可為空", 400);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return appError(next, "帳號或密碼錯誤", 400); // 無此用戶 > 防止駭客猜帳號, 回應罐頭訊息
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(next, "帳號或密碼錯誤", 400); // 密碼錯誤 > 防止駭客猜帳號, 回應罐頭訊息
    }
    // 產生 JWT 憑證, 200: 請求成功
    generateSendJWT(user, 200, res);
  },
  async getProfile(req, res, next) {
    res.status(200).json({
      status: "success",
      user: req.user, // 將 isAuth 驗證後夾帶的 user 回傳
    });
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body; // 新的密碼
    // 內容不可為空
    if (!password) {
      return appError(next, "密碼未填寫", 400);
    } else if (!confirmPassword) {
      return appError(next, "確認密碼未填寫", 400);
    }

    if (password !== confirmPassword) {
      return appError(next, "密碼不一致！", 400);
    }

    if (!validator.isLength(password, { min: 8 })) {
      return appError(next, "密碼字數低於 8 碼", 400);
    }

    const newPassword = await bcrypt.hash(password, 12); // 加密新密碼

    // 已經過 isAuth middleware 驗證登入, 表示登入有效, 直接修改密碼
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, {
      password: newPassword,
    });

    if (!user) {
      return appError(next, "查無用戶資料", 400);
    }

    generateSendJWT(user, 200, res);
  },
};

module.exports = controller;
