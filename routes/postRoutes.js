const express = require("express");
const router = express.Router();

const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router
  .route("/")
  .get(getPosts)
  .post(protect, upload.single("coverImage"), createPost);

router
  .route("/:slug")
  .get(getPost)
  .delete(protect, deletePost)
  .put(protect, upload.single("coverImage"), updatePost);

router.post("/:slug/like", protect, likePost);

module.exports = router;
