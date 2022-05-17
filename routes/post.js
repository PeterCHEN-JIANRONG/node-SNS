var express = require("express");
var router = express.Router();
const PostController = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");

// 取得單筆貼文 by Id
router.get("/:id", handleErrorAsync(PostController.getOneById));

// 新增貼文
router.post("/", handleErrorAsync(PostController.createOne));

// 刪除單筆貼文 by Id
router.delete("/:id", handleErrorAsync(PostController.deleteOneById));

// 更新貼文 by Id
router.patch("/:id", handleErrorAsync(PostController.updateOneById));

module.exports = router;
