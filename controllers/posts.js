const { errorHandle, successHandle } = require("../services/httpHandle");
const Post = require("../models/post");

const posts = {
  async getPosts(req, res) {
    const allPosts = await Post.find();
    successHandle(res, allPosts);
  },
  async createPost(req, res) {
    try {
      const { name, content, image, tags, type, likes, comments } = req.body;

      // 前端阻擋 - 欄位格式不正確
      if (name === undefined) {
        errorHandle(res, "姓名未填寫");
      } else if (content === undefined) {
        errorHandle(res, "內容未填寫");
      } else if (tags === undefined) {
        errorHandle(res, "標籤未填寫");
      } else if (type === undefined) {
        errorHandle(res, "貼文類型未填寫");
      } else {
        // 新增資料
        const postData = {
          name,
          content,
          image,
          tags,
          type,
          likes,
          comments,
        };
        const newPost = await Post.create(postData);
        successHandle(res, newPost);
      }
    } catch (err) {
      errorHandle(res, err);
    }
  },
  async deleteAllPosts(req, res) {
    await Post.deleteMany({});
    const allPosts = await Post.find();
    successHandle(res, allPosts);
  },
  async deletePostById(req, res) {
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
  async updatePostById(req, res) {
    try {
      const data = req.body;
      const { name, content, image, tags, type, likes, comments } = data;
      const { id } = req.params;
      const postData = {
        name,
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

module.exports = posts;
