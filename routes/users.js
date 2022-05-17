var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");

// 取得全部
router.get("/", handleErrorAsync(UserController.getAll));

// 刪除全部
router.delete("/", handleErrorAsync(UserController.deleteAll));

module.exports = router;
