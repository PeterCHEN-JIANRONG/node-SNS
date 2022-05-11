const { errorHandle, successHandle } = require("../services/httpHandle");
const Post = require("../models/post");
const User = require("../models/user");

// Post controller
const controller = {
  async getOneById(req, res) {
    try {
      const { id } = req.params;
      const item = await Post.findById(id).populate({
        path: "user", // 對應 Post model 的 user field
        select: "name photo", // 關聯後，要撈的欄位資料
      });

      if (item !== null) {
        successHandle(res, item);
      } else {
        errorHandle(res, "查無此 ID"); // 查無 id
      }
    } catch (err) {
      // 預防: 網址未帶入 id
      errorHandle(res, err);
    }
  },
  async getAll(req, res) {
    // 時間排序
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    // 搜尋貼文內容關鍵字
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};

    const allPosts = await Post.find(q)
      .populate({
        path: "user", // 對應 Post model 的 user field
        select: "name photo", // 關聯後，要撈的欄位資料
      })
      .sort(timeSort);
    successHandle(res, allPosts);
  },
  async createOne(req, res) {
    try {
      const { user, content, image, tags, type, likes, comments } = req.body;

      // 前端阻擋 - 欄位格式不正確
      if (!user) {
        errorHandle(res, "使用者ID未填寫");
      } else if (!content) {
        errorHandle(res, "內容未填寫");
      } else if (!tags) {
        errorHandle(res, "標籤未填寫");
      } else if (!type) {
        errorHandle(res, "貼文類型未填寫");
      } else {
        // 新增資料
        const postData = {
          user,
          content,
          image,
          tags,
          type,
          likes,
          comments,
        };

        const findUser = await User.findById(user).exec(); // 確認使用者ID存在
        if (findUser) {
          const newPost = await Post.create(postData);
          successHandle(res, newPost);
        } else {
          errorHandle(res, "使用者ID不存在");
        }
      }
    } catch (err) {
      errorHandle(res, err);
    }
  },
  async deleteAll(req, res) {
    await Post.deleteMany({});
    const allPosts = await Post.find();
    successHandle(res, allPosts);
  },
  async deleteOneById(req, res) {
    try {
      const { id } = req.params;
      const deletePost = await Post.findByIdAndDelete(id);
      if (deletePost !== null) {
        successHandle(res, deletePost); // 單筆刪除成功
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
      const { user, content, image, tags, type, likes, comments } = req.body;
      const { id } = req.params;
      const postData = {
        user,
        content,
        image,
        tags,
        type,
        likes,
        comments,
      };
      const options = {
        new: true, // 回傳更新"後"的資料, default: false 回傳更新"前"的資料
        runValidators: true, // 驗證修改資料
      };
      const editPost = await Post.findByIdAndUpdate(id, postData, options);

      if (editPost !== null) {
        successHandle(res, editPost);
      } else {
        errorHandle(res, "查無此 ID"); // 查無 id
      }
    } catch (err) {
      // 預防: JSON 解析失敗、網址未帶入 id
      errorHandle(res, err);
    }
  },
};

module.exports = controller;
