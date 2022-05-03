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
      // select: false, // 信箱必須隱藏
    },
    photo: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// model
const User = new model("User", userSchema);

module.exports = User;
