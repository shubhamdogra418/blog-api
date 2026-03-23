const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

//all apis logic will be written here

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    message: "Feteched all categories successfully!!!",
    count: categories.length,
    categories,
  });
});

//Get single category by slug
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate(
    "createdBy",
    "name email",
  );
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  res
    .status(200)
    .json({ message: "Category fetched successfully", category: category });
});
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400);
    throw new Error("Name and Description is required");
  }
  //as name is unique so cant put another one with the same name
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const newCat = await Category.create({
    name,
    description,
    createdBy: req.user._id,
  });
  await newCat.populate("createdBy", "name email");
  res
    .status(201)
    .json({ message: "Category created successfully", category: newCat });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }
  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;

  const updatedCategory = await Category.save();
  res.status(200).json({
    message: " Category updates successfully",
    category: updatedCategory,
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }
  await Category.deleteOne();
  res.status(200).json({ message: "Category has been deleted successfully" });
});

module.exports = {
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory,
};
