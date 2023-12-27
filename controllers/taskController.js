const { ERROR_MESSAGES, RESPONSE_MESSAGES } = require("../config/constants");
const logger = require("../config/logger");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  InternalServerError,
} = require("../middleware/error");
const { taskValidation } = require("../middleware/validationMiddleware");
const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(UnauthorizedError.statusCode)
        .send({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const tasks = await Task.find({ user: req.user._id });
    return res.send(tasks);
  } catch (err) {
    logger.error(InternalServerError.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.createTask = async (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return res
      .status(BadRequestError.statusCode)
      .send({ message: error.details[0].message });
  }
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      user: req.user._id,
    });

    const task = await newTask.save();

    return res.send(task);
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).select("-__v");

    if (!task)
      return res
        .status(NotFoundError.statusCode)
        .send({ message: ERROR_MESSAGES.TASK_NOT_FOUND });

    return res.json(task);
  } catch (err) {
    logger.error(InternalServerError.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.updateTask = async (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return res
      .status(BadRequestError.statusCode)
      .send({ message: error.details[0].message });
  }
  const { title, description } = req.body;

  const taskFields = {
    title,
    description,
    user: req.user,
  };

  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res
        .status(NotFoundError.statusCode)
        .json({ message: ERROR_MESSAGES.TASK_NOT_FOUND });

    if (task.user.toString() !== req.user.id) {
      return res
        .status(ForbiddenError.statusCode)
        .json({ message: ERROR_MESSAGES.NOT_AUTHORIZED });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: taskFields },
      { new: true }
    );

    return res.send(updatedTask);
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task)
      return res
        .status(NotFoundError.statusCode)
        .json({ message: ERROR_MESSAGES.TASK_NOT_FOUND });

    if (task.user.toString() !== req.user.id) {
      return res
        .status(ForbiddenError.statusCode)
        .json({ message: ERROR_MESSAGES.NOT_AUTHORIZED });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    return res.send({ message: RESPONSE_MESSAGES.TASK_REMOVED });
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
