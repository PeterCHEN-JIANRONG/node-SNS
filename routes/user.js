var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");

// 取得單筆 by Id
router.get("/:id", UserController.getOneById);

// 新增
router.post("/", UserController.createOne);

// 刪除單筆 by Id
router.delete("/:id", UserController.deleteOneById);

// 更新 by Id
router.patch("/:id", UserController.updateOneById);

module.exports = router;
