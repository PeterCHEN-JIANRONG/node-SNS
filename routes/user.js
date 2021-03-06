const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

// 用戶註冊
router.post("/user/sign_up", handleErrorAsync(UserController.signUp));

// 用戶登入
router.post("/user/sign_in", handleErrorAsync(UserController.signIn));

// 取得用戶資料, 需驗證 jwt登入
router.get(
  "/user/profile",
  isAuth,
  handleErrorAsync(UserController.getProfile)
);

// 取得指定用戶資料
router.get(
  "/user/:id/profile",
  isAuth,
  handleErrorAsync(UserController.getProfileById)
);

// 更新用戶資料
router.patch(
  "/user/profile",
  isAuth,
  handleErrorAsync(UserController.updateProfile)
);

// 用戶更新密碼
router.patch(
  "/user/updatePassword",
  isAuth,
  handleErrorAsync(UserController.updatePassword)
);

// 取得按讚列表
router.get(
  "/user/getLikeList",
  isAuth,
  handleErrorAsync(UserController.getLikeList)
);

// 追蹤用戶
router.post(
  "/user/:id/follow",
  isAuth,
  handleErrorAsync(UserController.followUserById)
);

// 取消追蹤用戶
router.delete(
  "/user/:id/follow",
  isAuth,
  handleErrorAsync(UserController.unFollowUserById)
);

// 取得個人追蹤名單
router.get(
  "/user/following",
  isAuth,
  handleErrorAsync(UserController.getFollowingList)
);

// --- 以下為後台工具 ---
// 刪除單筆用戶 by Id
router.delete(
  "/admin/user/:id",
  handleErrorAsync(UserController.deleteOneById)
);

// 取得全部用戶
router.get("/admin/users/", handleErrorAsync(UserController.getAll));

// 刪除全部用戶
router.delete("/admin/users/", handleErrorAsync(UserController.deleteAll));

module.exports = router;
