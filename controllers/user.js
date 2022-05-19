const { successHandle } = require("../services/httpHandle");
const User = require("../models/userModel");
const appError = require("../services/appError");

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
    } else if (!sex) {
      return appError(next, "性別未填寫");
    } else if (!["male", "female"].includes(sex)) {
      return appError(next, `性別欄位錯誤，須為 'male' 或 'female'`);
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
};

module.exports = controller;
