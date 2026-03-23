const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
  createCategory,
} = require("../controllers/categoryController");

const {} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getCategories) //public
  .post(protect, adminOnly, createCategory); //admin only
router
  .route("/:slug")
  .get(getCategory) //public
  .put(protect, adminOnly, updateCategory) //admin only
  .delete(protect, adminOnly, deleteCategory); //admin only

module.exports = router;
