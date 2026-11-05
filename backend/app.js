require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { uploadDir } = require("./middleware/upload");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// Routes
app.get("/", (req, res) => res.send("TaskManager API running"));
app.use("/api/tasks", taskRoutes);

// Upload / generic error handler (e.g. file too large)
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
