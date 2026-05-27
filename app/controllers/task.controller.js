const Task = require("../models/task.model");

exports.addTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, category, labels } = req.body;
        
        // Basic validation
        if (!title) {
            return res.status(400).json({ success: false, message: "Task title is required" });
        }

        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            category,
            labels,
            user: req.user.id,
            order: Date.now() // simple ordering strategy
        });

        await task.save();
        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.editTask = async (req, res) => {
    try {
        const updateFields = { ...req.body };
        // prevent updating user field
        delete updateFields.user;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markCompleted = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { status: "Completed" },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.listTasks = async (req, res) => {
    try {
        const { status, category, labels, dateFilter } = req.query;
        let query = { user: req.user.id };

        if (status) query.status = status;
        if (category) query.category = category;
        if (labels) {
            // comma separated labels in query
            const labelsArray = labels.split(",");
            query.labels = { $in: labelsArray };
        }

        if (dateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            if (dateFilter === "today") {
                query.dueDate = { $gte: today, $lt: tomorrow };
            } else if (dateFilter === "tomorrow") {
                const dayAfterTomorrow = new Date(tomorrow);
                dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
                query.dueDate = { $gte: tomorrow, $lt: dayAfterTomorrow };
            } else if (dateFilter === "this_week") {
                query.dueDate = { $gte: today, $lt: nextWeek };
            }
        }

        const tasks = await Task.find(query)
            .sort({ order: 1 })
            .populate("category", "name")
            .populate("labels", "name");

        res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.reorderTasks = async (req, res) => {
    try {
        const { taskOrders } = req.body; // array of { taskId, order }

        if (!Array.isArray(taskOrders)) {
            return res.status(400).json({ success: false, message: "taskOrders must be an array" });
        }

        // Bulk update
        const bulkOps = taskOrders.map(item => ({
            updateOne: {
                filter: { _id: item.taskId, user: req.user.id },
                update: { order: item.order }
            }
        }));

        await Task.bulkWrite(bulkOps);

        res.status(200).json({ success: true, message: "Tasks reordered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
