const { ERROR_MESSAGES, RESPONSE_MESSAGES } = require("../config/constants");
const logger = require("../config/logger");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");

const { taskValidation } = require("../middleware/validationMiddleware");
const Task = require("../models/Task");

exports.getAllTasks = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    }
    const tasks = await Task.find({ user: req.user._id });
    return res.send(tasks);
  } catch (err) {
    logger.error(InternalServerError.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

exports.createTask = async (req, res, next) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  const { title, description, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
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
    return next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).select("-__v");

    if (!task) return next(new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND));

    return res.json(task);
  } catch (err) {
    logger.error(InternalServerError.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

exports.updateTask = async (req, res, next) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  const { title, description, status } = req.body;

  const taskFields = {
    title,
    description,
    status,
    user: req.user,
  };

  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) return next(new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND));

    if (task.user.toString() !== req.user.id) {
      return next(new ForbiddenError(ERROR_MESSAGES.NOT_AUTHORIZED));
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
    return next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) return next(new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND));

    if (task.user.toString() !== req.user.id) {
      return next(new ForbiddenError(ERROR_MESSAGES.NOT_AUTHORIZED));
    }

    await Task.findByIdAndDelete(req.params.taskId);

    return res.send({ message: RESPONSE_MESSAGES.TASK_REMOVED });
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    return next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};
