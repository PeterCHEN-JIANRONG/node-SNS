var express = require("express");
var router = express.Router();
const PostController = require("../controllers/post");

// 取得單筆貼文 by Id
router.get("/:id", PostController.getOneById);

// 新增貼文
router.post("/", PostController.createOne);

// 刪除單筆貼文 by Id
router.delete("/:id", PostController.deleteOneById);

// 更新貼文 by Id
router.patch("/:id", PostController.updateOneById);

module.exports = router;
