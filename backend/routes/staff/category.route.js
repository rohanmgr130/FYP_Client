const express = require("express");
const categoryroute = express.Router();
const upload = require("../../utils/multer");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../../controllers/staff/category");

// POST /api/admin/category
categoryroute.post("/", upload.single("image"), createCategory);

// GET /api/admin/category
categoryroute.get("/get-all-category", getAllCategories);

// GET /api/admin/category/:id
categoryroute.get("/:id", getCategoryById);

// PUT /api/admin/category/:id
categoryroute.put("/:id", upload.single("image"), updateCategory);

// DELETE /api/admin/category/:id
categoryroute.delete("/:id", deleteCategory);

module.exports = categoryroute;
