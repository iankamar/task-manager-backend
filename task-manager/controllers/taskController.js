const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });

    const task = await newTask.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateTask = async (req, res) => {
  const { title, description } = req.body;

  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
