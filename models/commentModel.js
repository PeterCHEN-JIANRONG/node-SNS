const { Schema, model, pre } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "請輸入留言"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "留言者 ID 未填寫"],
    },
    post: {
      type: Schema.ObjectId,
      ref: "Post",
      required: [true, "貼文 ID 未填寫"],
    },
  },
  {
    versionKey: false,
  }
);

// 前置器
// /^find/ 所有 find 開頭的語法都會套用此設定
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user", // 將 user field 做關聯
    select: "name photo",
  });

  next();
});

const Comment = new model("Comment", commentSchema);

module.exports = Comment;
