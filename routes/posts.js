var express = require("express");
var router = express.Router();
const PostController = require("../controllers/post");

// 取得所有貼文
router.get("/", PostController.getAll);

// 刪除所有貼文
router.delete("/", PostController.deleteAll);

module.exports = router;
