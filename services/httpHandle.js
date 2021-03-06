const errorHandle = (res, err, httpCode = 400) => {
  const obj = {
    status: "error",
    message: "欄位未填寫正確或無此 id",
  };

  if (typeof err === "string" && err !== "") {
    obj.message = err;
  } else if (err.message) {
    obj.message = err.message;
  }
  res.status(httpCode).json(obj);
};

const successHandle = (res, data, message = "", status = 200) => {
  const obj = {
    status: "success",
    data,
  };
  if (message !== "") {
    // 若有 message 才加進去 res
    obj.message = message;
  }
  // res.json(obj); // .json() -> Content-Type:application:json
  res.status(status).send(obj); // .send() 自動判斷回傳 Content-Type, String -> text/html；Array、Object -> application:json
};

module.exports = {
  errorHandle,
  successHandle,
};
