const { decodeToken } = require("../helpers/jsonwebtoken");
const { Todo, Project } = require("../models");

function authentication(req, res, next) {
  try {
    req.loggedInUser = decodeToken(req.headers.token);
    next();
  } catch (err) {
    next(err);
  }
}

function todoAuthorization(req, res, next) {
  const userId = req.loggedInUser._id;
  const todoId = req.params.id;
  Todo.findById(todoId)
    .then(todo => {
      if (todo.userId == userId) {
        next();
      } else if (todo.projectId) {
        Project.findById(todo.projectId)
          .then(project => {
            if (project && project.users && project.users.includes(userId)) {
              next();
            } else
              next({
                statusCode: 401,
                msg: "not authorized"
              });
          })
          .catch(next);
      } else {
        next({
          statusCode: 401,
          msg: "not authorized"
        });
      }
    })
    .catch(next);
}

function projectAuthorization(req, res, next) {
  const userId = req.loggedInUser._id;
  const projectId = req.params.id;
  Project.findById(projectId)
    .then(project => {
      if (project.users.includes(userId)) {
        next();
      } else
        next({
          statusCode: 401,
          msg: "not authorized"
        });
    })
    .catch(next);
}

module.exports = {
  authentication,
  todoAuthorization,
  projectAuthorization
};
