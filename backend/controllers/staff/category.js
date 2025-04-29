const Category = require("../../models/staff/category");

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const image = `/uploads/${req.file.filename}`;

    const category = new Category({ name, description, image });
    await category.save();

    res.status(201).json({ success: true, message: "Category created", category });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const updateData = { name, description, isActive };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({ success: true, message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
