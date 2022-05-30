const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

// 取得單筆貼文 by 貼文Id
router.get("/post/:id", isAuth, handleErrorAsync(PostController.getOneById));

// 取得所有貼文
router.get("/posts/", isAuth, handleErrorAsync(PostController.getAll));

// 取得個人貼文 by userId
router.get(
  "/posts/:id",
  isAuth,
  handleErrorAsync(PostController.getPostsByUserId)
);

// 新增貼文
router.post("/post/", isAuth, handleErrorAsync(PostController.createOne));

// 更新貼文 by 貼文Id
router.patch(
  "/post/:id",
  isAuth,
  handleErrorAsync(PostController.updateOneById)
);

// 按讚貼文
router.post(
  "/post/:id/likes",
  isAuth,
  handleErrorAsync(PostController.likePostById)
);
// 取消按讚
router.delete(
  "/post/:id/likes",
  isAuth,
  handleErrorAsync(PostController.deleteLikePostById)
);

// --- 以下為後台工具 ---
// 刪除單筆貼文 by Id
router.delete(
  "/admin/post/:id",
  handleErrorAsync(PostController.deleteOneById)
);

// 刪除所有貼文
router.delete("/admin/posts/", handleErrorAsync(PostController.deleteAll));

module.exports = router;
