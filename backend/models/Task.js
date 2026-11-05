const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true, trim: true },
    assignedTo: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    attachment: { type: String, default: "" }, // saved file name
    attachmentType: { type: String, default: "" }, // mimetype
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
