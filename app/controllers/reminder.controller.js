const Reminder = require("../models/reminder.model");

exports.setReminder = async (req, res) => {
    try {
        const { taskId, type, time } = req.body;

        if (!taskId || !time) {
            return res.status(400).json({ success: false, message: "Task ID and time are required" });
        }

        const reminder = new Reminder({
            task: taskId,
            user: req.user.id,
            type: type || "Once",
            time
        });

        await reminder.save();
        res.status(201).json({ success: true, reminder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.editReminder = async (req, res) => {
    try {
        const { type, time } = req.body;
        
        const reminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { type, time },
            { new: true, runValidators: true }
        );

        if (!reminder) {
            return res.status(404).json({ success: false, message: "Reminder not found or unauthorized" });
        }

        res.status(200).json({ success: true, reminder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!reminder) {
            return res.status(404).json({ success: false, message: "Reminder not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
