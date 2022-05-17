var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");

// 取得單筆 by Id
router.get("/:id", handleErrorAsync(UserController.getOneById));

// 新增
router.post("/", handleErrorAsync(UserController.createOne));

// 刪除單筆 by Id
router.delete("/:id", handleErrorAsync(UserController.deleteOneById));

// 更新 by Id
router.patch("/:id", handleErrorAsync(UserController.updateOneById));

module.exports = router;
