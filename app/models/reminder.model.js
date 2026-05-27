const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["Once", "Daily", "Weekly"],
        default: "Once"
    },
    time: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
