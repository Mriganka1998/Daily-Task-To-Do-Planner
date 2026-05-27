const Label = require("../models/label.model");

exports.addLabel = async (req, res) => {
    try {
        const { name } = req.body;
        const label = new Label({
            name,
            user: req.user.id
        });
        await label.save();
        res.status(201).json({ success: true, label });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.listLabels = async (req, res) => {
    try {
        const labels = await Label.find({ user: req.user.id });
        res.status(200).json({ success: true, count: labels.length, labels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
