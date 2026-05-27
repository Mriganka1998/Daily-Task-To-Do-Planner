const Category = require("../models/category.model");

exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({
            name,
            description,
            user: req.user.id
        });
        await category.save();
        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.editCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found or unauthorized" });
        }
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.listCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.status(200).json({ success: true, count: categories.length, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
