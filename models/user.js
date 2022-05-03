const { Schema, model } = require("mongoose");

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "姓名未填寫"],
    },
    email: {
      type: String,
      required: [true, "信箱未填寫"],
      unique: true,
      lowercase: true,
      select: false, // 信箱必須隱藏
    },
    photo: String,
    gender: {
      type: String,
      enum: ["woman", "man"],
      required: [true, "性別未填寫"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// model
const User = new model("User", userSchema);
// model name -> "User",
// collection 自動小寫+s -> users

module.exports = User;
