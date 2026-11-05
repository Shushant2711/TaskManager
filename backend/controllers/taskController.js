const fs = require("fs");
const path = require("path");
const Task = require("../models/Task");
const { uploadDir } = require("../middleware/upload");

const removeFile = (name) => {
  if (name) fs.unlink(path.join(uploadDir, name), () => {});
};

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.attachment = req.file.filename;
      data.attachmentType = req.file.mimetype;
    }
    const task = await Task.create(data);
    res.status(201).json(task);
  } catch (err) {
    if (req.file) removeFile(req.file.filename);
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/tasks/:id  (file na bheji to purani attachment same rahegi)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const data = { ...req.body };
    if (req.file) {
      removeFile(task.attachment);
      data.attachment = req.file.filename;
      data.attachmentType = req.file.mimetype;
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    removeFile(task.attachment);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
