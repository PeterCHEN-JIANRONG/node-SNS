const { errorHandle, successHandle } = require("../services/httpHandle");
const User = require("../models/user");

// User controllers
const controllers = {
  async getAll(req, res) {
    const allItems = await User.find();
    successHandle(res, allItems);
  },
  async createOne(req, res) {
    try {
      const { name, email, photo } = req.body;

      // 前端阻擋 - 欄位格式不正確
      if (!name) {
        errorHandle(res, "姓名未填寫");
      } else if (!email) {
        errorHandle(res, "信箱未填寫");
      } else {
        // 新增資料
        const data = {
          name,
          email,
          photo,
        };
        const newItem = await User.create(data);
        successHandle(res, newItem);
      }
    } catch (err) {
      errorHandle(res, err);
    }
  },
  async deleteAll(req, res) {
    await User.deleteMany({});
    const allItems = await User.find();
    successHandle(res, allItems);
  },
  async deleteOneById(req, res) {
    try {
      const { id } = req.params;
      const deleteItem = await User.findByIdAndDelete(id);
      if (deleteItem !== null) {
        successHandle(res, deleteItem); // 單筆刪除成功
      } else {
        errorHandle(res, "查無此 ID"); // 查無 id
      }
    } catch (err) {
      // 預防: 網址未帶入 id
      errorHandle(res, err);
    }
  },
  async updateOneById(req, res) {
    try {
      const { name, email, photo } = req.body;
      const { id } = req.params;
      const data = {
        name,
        email,
        photo,
      };
      const options = {
        new: true, // 回傳更新"後"的資料, default: false 回傳更新"前"的資料
        runValidators: true, // 驗證修改資料
      };
      const editItem = await User.findByIdAndUpdate(id, data, options);

      if (editItem !== null) {
        successHandle(res, editItem); // 修改成功
      } else {
        errorHandle(res, "查無此 ID"); // 查無 id
      }
    } catch (err) {
      // 預防: JSON 解析失敗、網址未帶入 id
      errorHandle(res, err);
    }
  },
};

module.exports = controllers;
