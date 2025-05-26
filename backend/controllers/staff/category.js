

const Category = require("../../models/staff/category");
const path = require("path");
const fs = require("fs");

// Create a new category
const createCategory = async (req, res) => {
  try {
    // Check if required fields are provided
    if (!req.body.name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }

    // Create new category
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: req.file.path.replace(/\\/g, "/").substring(req.file.path.indexOf("uploads/")),
    });

    // Save category to database
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    // Find the category
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category fields
    if (req.body.name) {
      category.name = req.body.name;
    }
    
    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    // Handle image update if a new one is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, "../../../", category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image path
      category.image = req.file.path.replace(/\\/g, "/").substring(req.file.path.indexOf("uploads/"));
    }

    // Save updated category
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    // Find the category
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete category image from the filesystem if it exists
    if (category.image) {
      const imagePath = path.join(__dirname, "../../../", category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};