var express = require("express");
var router = express.Router();
const PostController = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");

// 取得所有貼文
router.get("/", handleErrorAsync(PostController.getAll));

// 刪除所有貼文
router.delete("/", handleErrorAsync(PostController.deleteAll));

module.exports = router;
