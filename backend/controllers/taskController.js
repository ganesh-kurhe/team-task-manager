const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, projectId, description, dueDate, assignedTo } = req.body;
  if (!title || !projectId) {
    return res.status(400).json({ msg: "Title and project are required." });
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    dueDate,
    assignedTo: assignedTo || req.user.id,
  });

  res.json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  const isAdmin = req.user.role === "admin";
  const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;

  if (!isAdmin && !isAssignee) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  if (req.body.status) task.status = req.body.status;
  await task.save();

  res.json(task);
};

exports.getTasks = async (req, res) => {
  const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
  const tasks = await Task.find(query).populate("assignedTo", "name email").populate("projectId", "name");
  res.json(tasks);
};