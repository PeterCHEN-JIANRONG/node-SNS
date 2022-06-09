const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload")
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");
const  uploadImage  = require("../middleware/image");

// 多圖上傳
router.post('/photos',isAuth,uploadImage.array('photos', 8),handleErrorAsync(uploadController.uploadImages));

// 單圖上傳 / 大頭照
router.post('/avatar',isAuth,uploadImage.single('avatar'),handleErrorAsync(uploadController.uploadAvatar));

module.exports = router;
