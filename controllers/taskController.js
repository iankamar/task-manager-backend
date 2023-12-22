const Task = require("../models/Task");
const { ERROR_MESSAGES, RESPONSE_MESSAGES } = require("../constants");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    return res.json(tasks);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
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

    return res.json(task);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res.status(404).json({ msg: ERROR_MESSAGES.TASK_NOT_FOUND });

    return res.json(task);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.updateTask = async (req, res) => {
  const { title, description } = req.body;

  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;

  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res.status(404).json({ msg: ERROR_MESSAGES.TASK_NOT_FOUND });

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: ERROR_MESSAGES.NOT_AUTHORIZED });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: taskFields },
      { new: true }
    );

    return res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res.status(404).json({ msg: ERROR_MESSAGES.TASK_NOT_FOUND });

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: ERROR_MESSAGES.NOT_AUTHORIZED });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    return res.json({ msg: RESPONSE_MESSAGES.TASK_REMOVED });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};
