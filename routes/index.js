const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// OPTIONS 預檢請求
router.options("/", (req, res) => {
  res
    .status(200)
    .send({
      status: "success",
    })
    .end();
});

module.exports = router;
