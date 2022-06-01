const { default: mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");

// Schema
const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // 對應 user model 的 model name
      required: [true, "使用者 ID 未填寫"],
    },
    content: {
      type: String,
      required: [true, "內容未填寫"],
    },
    image: {
      type: Array,
      default: [],
    },
    tags: [
      {
        type: String,
        required: [true, "標籤未填寫"],
      },
    ],
    type: {
      type: String,
      enum: ["person", "group"],
      required: [true, "貼文類型未填寫"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      // select: false,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true }, // 虛擬欄位設定
    toObject: { virtuals: true }, // 虛擬欄位設定
  }
);

// 引用虛擬欄位 (相似：關聯資料庫的 join 關聯)
// 需透過 populate 啟用
postSchema.virtual("comments", {
  ref: "Comment", // 引用 model 名稱
  foreignField: "post", // 引用欄位名稱 commentModel.post
  localField: "_id", // postsModel._id
});

// model
const Post = new model("Post", postSchema);

module.exports = Post;
