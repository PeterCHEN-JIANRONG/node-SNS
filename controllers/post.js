const { successHandle } = require("../services/httpHandle");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const appError = require("../services/appError");

// Post controller
const controller = {
  async getOneById(req, res, next) {
    const { id } = req.params;
    const item = await Post.findById(id).populate({
      path: "user", // 對應 Post model 的 user field
      select: "name photo", // 關聯後，要撈的欄位資料
    });

    if (item !== null) {
      successHandle(res, item);
    } else {
      return appError(next, "查無此 ID"); // 查無 id
    }
  },
  async getAll(req, res, next) {
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
  async getPostsByUserId(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";

    const { id } = req.params; // user ID
    const filter = { user: id };

    // 搜尋貼文內容關鍵字
    if (req.query.q !== undefined) {
      filter.content = new RegExp(req.query.q);
    }

    const allPosts = await Post.find(filter)
      .populate({
        path: "user", // 對應 Post model 的 user field
        select: "name photo", // 關聯後，要撈的欄位資料
      })
      .sort(timeSort);
    successHandle(res, allPosts);
  },
  async createOne(req, res, next) {
    const { content, image, tags, type } = req.body;

    // 欄位格式不正確
    if (!content) {
      return appError(next, "內容未填寫");
    } else if (!tags) {
      return appError(next, "標籤未填寫");
    } else if (!type) {
      return appError(next, "貼文類型未填寫");
    } else {
      // 新增貼文
      const { id } = req.user; // isAuth middleware 取得的 user
      const postData = {
        user: id,
        content,
        image,
        tags,
        type,
      };

      // 經過 isAuth, 用戶id一定存在, 不用再驗證用戶是否存在, 可直接新增貼文
      const newPost = await Post.create(postData);
      successHandle(res, newPost);
    }
  },
  async deleteAll(req, res, next) {
    await Post.deleteMany({});
    const allPosts = await Post.find();
    successHandle(res, allPosts);
  },
  async deleteOneById(req, res, next) {
    const { id } = req.params;
    const deletePost = await Post.findByIdAndDelete(id);
    if (deletePost !== null) {
      successHandle(res, deletePost); // 單筆刪除成功
    } else {
      return appError(next, "查無此 ID");
    }
  },
  async updateOneById(req, res, next) {
    const { content, image, tags, type, likes, comments } = req.body;
    const userId = req.user.id; // 用戶ID
    const postId = req.params.id; // 貼文ID

    const data = {
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
    const post = await Post.findById(postId);
    if (userId !== post.user.toString()) {
      // 若貼文的user 與 登入者Id 不同，則不可修改
      return appError(next, "您無權限修改");
    }

    if (!content) {
      return appError(next, "貼文內容為必填");
    }

    const editPost = await Post.findByIdAndUpdate(postId, data, options);
    successHandle(res, editPost);
  },
  async likePostById(req, res, next) {
    const userId = req.user.id; // 用戶ID
    const postId = req.params.id; // 貼文ID
    await Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } } // 不重複新增
    );
    successHandle(res, { userId, postId });
  },
  async deleteLikePostById(req, res, next) {
    const userId = req.user.id; // 用戶ID
    const postId = req.params.id; // 貼文ID
    await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } } // 移除所有 userId 相同的
    );
    successHandle(res, { userId, postId });
  },
};

module.exports = controller;
