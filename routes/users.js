var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");

// 取得全部
router.get("/", UserController.getAll);

// 刪除全部
router.delete("/", UserController.deleteAll);

module.exports = router;
