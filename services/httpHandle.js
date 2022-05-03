const errorHandle = (res, err) => {
  const obj = {
    status: false,
    message: "欄位未填寫正確或無此 id",
  };

  if (typeof err === "string" && err !== "") {
    obj.message = err;
  } else if (err.message) {
    obj.message = err.message;
  }
  res.status(400).json(obj);
};

const successHandle = (res, data, message = "") => {
  const obj = {
    status: true,
    data,
  };
  if (message !== "") {
    // 若有 message 才加進去 res
    obj.message = message;
  }
  // res.json(obj); // .json() -> Content-Type:application:json
  res.send(obj); // .send() 自動判斷回傳 Content-Type, String -> text/html；Array、Object -> application:json
};

module.exports = {
  errorHandle,
  successHandle,
};
