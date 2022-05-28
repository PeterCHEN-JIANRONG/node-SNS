const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload")
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");
const  uploadImage  = require("../middleware/image");

// 多圖上傳
router.post('/',isAuth,uploadImage,handleErrorAsync(uploadController.uploadImages));

module.exports = router;
