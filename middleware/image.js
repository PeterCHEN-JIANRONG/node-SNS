const multer = require('multer');
const path = require('path');
const upload = multer({
  limits: {
    fileSize: 2*1024*1024, // 限制圖片大小
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    // 限制圖片格式
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      const err = new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。");
      err.isOperational = true;
      err.statusCode = 400;
      cb(err);
    }
    cb(null, true); // true: 可以進到下個 middleware
  },
})
// }).any() // 不限制
// }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'photos', maxCount: 8 }])

module.exports = upload
