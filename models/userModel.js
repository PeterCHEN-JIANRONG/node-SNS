const { Schema, model } = require("mongoose");
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入您的名字"],
    },
    email: {
      type: String,
      required: [true, "請輸入您的信箱"],
      unique: true,
      lowercase: true,
      select: false, // 信箱必須隱藏
      validate: [validateEmail, "信箱格式錯誤"],
    },
    photo: String,
    sex: {
      type: String,
      enum: ["male", "female"],
      // required: [true, "請輸入您的性別"],
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minlength: 8,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    followers: [
      // 我被誰追蹤
      {
        _id: false,
        user: {
          type: Schema.ObjectId,
          ref: "User",
          required: [true, "追蹤者 ID 未填寫"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    following: [
      // 我追蹤的人
      {
        _id: false,
        user: {
          type: Schema.ObjectId,
          ref: "User",
          required: [true, "被追蹤者 ID 未填寫"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// model
const User = new model("User", userSchema);
// model name -> "User",
// collection 自動小寫+s -> users

module.exports = User;
