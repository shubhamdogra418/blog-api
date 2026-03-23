const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

// get all posts
const getPosts = asyncHandler(async (req, res) => {
  //show all the info when getting the response
  const posts = await Post.find({ isPublished: true })
    .populate("author", "name avatar")
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Posts fetched successfully",
    count: posts.length,
    posts: posts,
  });
});

//get single post
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate("author", "name avatar bio")
    .populate("category", "name slug");

  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  res.status(200).json({ message: "Post fecthed successfully", post });
});

//create Post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, isPublished } = req.body;
  const newPost = await Post.create({
    title,
    content,
    category,
    isPublished,
    author: req.user._id,
    coverImage: req.file ? req.file.filename : "default-cover.jpg",
  });

  await newPost.populate("author", "name avatar");
  await newPost.populate("category", "name slug");

  res.status(201).json({ message: "Post created successfully", newPost });
});

//delete post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }

  //only a author or admin can delete
  if (
    post.author.toString !== req.user._id.toString &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }
  await Post.deleteOne();
  res.status(200).json({ message: "Post deleted successfully" });
});

//update post
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  // Only author can update their own post
  if (post.author.toString !== req.user._id) {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }
  //take all the data
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.category = req.body.category || post.category;
  post.isPublished = req.body.isPublished || post.isPublished;

  if (req.file) {
    post.coverImage = req.file.filename;
  }
  //to make sure pre hook runs
  const updatedPost = await Post.save();
  updatePost.populate("auhtor", "name avatar");
  updatePost.populate("category", "name slug");

  res
    .status(200)
    .json({ message: "Post updated successfully", post: updatedPost });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }
  //get the userid and see in post likes if this user exists if yes then remove else add
  const userId = req.user._id.toString();
  const alreadyLiked = await Post.likes.some((id) => id.toString() === userId);
  if (alreadyLiked) {
    //dislike means remove this userId from likes
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.status(200).json({
    message: alreadyLiked ? "Post unliked" : "Post liked",
    totalLikes: post.likes.length,
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
};
