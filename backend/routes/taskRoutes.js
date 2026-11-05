const express = require("express");
const { upload } = require("../middleware/upload");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", upload.single("attachment"), createTask);
router.put("/:id", upload.single("attachment"), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
