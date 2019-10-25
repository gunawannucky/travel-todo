const { Todo, Project } = require("../models");

class TodoController {
  static create(req, res, next) {
    const userId = req.loggedInUser._id;
    let { name, description, dueDate, projectId } = req.body;
    dueDate = new Date(dueDate);
    if (new Date(dueDate) < new Date()) {
      next({
        statusCode: 400,
        message: "invalid due date"
      });
    } else {
      if (!projectId) {
        Todo.create({
          name,
          description,
          dueDate,
          userId
        })
          .then(todo => {
            res.status(201).json(todo);
          })
          .catch(next);
      } else {
        let newTodo;
        Todo.create({
          name,
          description,
          dueDate,
          projectId
        })
          .then(todo => {
            newTodo = todo;
            return Project.findByIdAndUpdate(
              projectId,
              {
                $push: {
                  todos: newTodo._id
                }
              },
              {
                new: true,
                runValidators: true
              }
            );
          })
          .then(_ => {
            res.status(201).json(newTodo);
          })
          .catch(next);
      }
    }
  }

  static findTodosByUserId(req, res, next) {
    const userId = req.loggedInUser._id;
    Todo.find({
      userId
    })
      .then(todos => {
        res.status(200).json({
          todos
        });
      })
      .catch(next);
  }

  static updateOnId(req, res, next) {
    const id = req.params.id;
    const { name, description, dueDate, projectId, status } = req.body;
    const update = { name, description, dueDate, projectId, status };
    Todo.findByIdAndUpdate(id, update, {
      new: true,
      omitUndefined: true,
      runValidators: true
    })
      .then(updatedTodo => {
        res.status(200).json(updatedTodo);
      })
      .catch(next);
  }

  static deleteOnId(req, res, next) {
    const { id } = req.params;
    $ModelName
      .findByIdAndDelete(id)
      .then(_ => {
        res.status(204).json();
      })
      .catch(next);
  }
}

module.exports = TodoController;
