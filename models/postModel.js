const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxLength: [100, "Post title length can't exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxLength: [300, "Post title length can't exceed 100 characters"],
    },
    coverImage: {
      type: String,
      default: "default-cover.jpg",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    //lets authors save drafts without making them public yet.
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

//mongoose pre save hook - to save some data before submitting the doc
postSchema.pre("save", function () {
  if (!this.isModified("title")) return;
  this.slug = this.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
});

module.exports = mongoose.model("Post", postSchema);
