var express = require("express");
var router = express.Router();
const UsersController = require("../controllers/users");

// 取得
router.get("/", UsersController.getAll);

// 新增
router.post("/", UsersController.createOne);

// 刪除全部
router.delete("/", UsersController.deleteAll);

// 刪除單筆 by Id
router.delete("/:id", UsersController.deleteOneById);

// 更新 by Id
router.patch("/:id", UsersController.updateOneById);

module.exports = router;
