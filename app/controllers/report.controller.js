const Task = require("../models/task.model");
const User = require("../models/user.model");
const sendEmail = require("../utils/email.util");

exports.getSummary = async (req, res) => {
    try {
        const { period } = req.query; // 'day' or 'week'

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let endDate = new Date(today);
        if (period === 'week') {
            endDate.setDate(endDate.getDate() + 7);
        } else {
            // default to day
            endDate.setDate(endDate.getDate() + 1);
        }

        const tasks = await Task.find({
            user: req.user.id,
            dueDate: { $gte: today, $lt: endDate }
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "Completed").length;
        const pendingTasks = totalTasks - completedTasks;

        res.status(200).json({
            success: true,
            summary: {
                period: period || 'day',
                totalTasks,
                completedTasks,
                pendingTasks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "Completed").length;
        
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Calculate average time to complete if we were tracking completion dates (we aren't specifically, but we could approximate or just say it's out of scope unless we add a completedAt field. Let's add completedAt logic hypothetically or omit. I will omit since it requires schema update for completedAt)

        res.status(200).json({
            success: true,
            statistics: {
                totalTasks,
                completedTasks,
                completionRate: completionRate.toFixed(2) + "%"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendSummaryEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const today = new Date();
        const tasks = await Task.find({ user: req.user.id });

        const overdue = tasks.filter(t => t.status === "Pending" && t.dueDate && t.dueDate < today);
        const upcoming = tasks.filter(t => t.status === "Pending" && t.dueDate && t.dueDate >= today);
        const completed = tasks.filter(t => t.status === "Completed");

        const message = `
        Here is your task summary:
        
        Overdue Tasks: ${overdue.length}
        Upcoming Tasks: ${upcoming.length}
        Completed Tasks: ${completed.length}
        
        Have a productive day!
        `;

        await sendEmail({
            email: user.email,
            subject: "Your Daily/Weekly Task Summary",
            message
        });

        res.status(200).json({ success: true, message: "Summary email sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
