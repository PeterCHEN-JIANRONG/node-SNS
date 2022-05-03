var express = require("express");
var router = express.Router();
const PostsControllers = require("../controllers/posts");

// 取得貼文
router.get("/", PostsControllers.getPosts);

// 新增貼文
router.post("/", PostsControllers.createPost);

// 刪除全部貼文
router.delete("/", PostsControllers.deleteAllPosts);

// 刪除單筆貼文 by Id
router.delete("/:id", PostsControllers.deletePostById);

// 更新貼文 by Id
router.patch("/:id", PostsControllers.updatePostById);

module.exports = router;
