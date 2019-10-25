function fetchTodos() {
  axios({
    url: "/todos",
    method: "get",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") }
  })
    .then(({ data }) => {
      $("#todo-list").empty();
      let { todos } = data;
      todos.forEach(todo => {
        todo.dueDate = new Date(todo.dueDate);
        let doneBtn = "";
        if (todo.status === "undone") {
          doneBtn = `
                <button onclick="updateTodo('${todo._id}')" class="btn btn-primary btn-sm">Done it</button>
            `;
        }

        let card = `
                    <div class="card">
                        <div class="card-header">
                        ${todo.name}
                        </div>
                        <div class="card-body">
                        <p>
                            ${todo.description}
                        </p>
                        <div class="d-flex justify-content-between fw">
                        <small>Due : ${("0" + todo.dueDate.getDate()).slice(
                          -2
                        )} / ${("0" + (todo.dueDate.getMonth() + 1)).slice(
          -2
        )} / ${todo.dueDate.getFullYear()}</small>
                        <small> Status : ${todo.status} </small>    
                        </div>
                        </div>
                        <div class="card-footer">
                        <div class="d-flex justify-content-between fw">
                        
                        <button onclick="deleteTodo('${
                          todo._id
                        }')" class="btn btn-danger btn-sm">Delete</button>
                        
                        ${doneBtn}
                        </div>
                        </div>
                    </div>
                
            `;

        $("#todo-list").append(card);
      });
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}

function goCreateTodo(projectId) {
  hideAll();
  if (projectId) {
    let inputProject = `
        <input id="add-todo-project" type="hidden" value="${projectId}">
    `;
    $("#containInput").empty();
    $("#containInput").append(inputProject);
  }
  $("#post-todos-page").show();
}

$("#add-todo-form").submit(function(event) {
  event.preventDefault();
  let data = {
    name: $("#add-todo-name").val(),
    description: $("#add-todo-description").val(),
    dueDate: $("#add-todo-date").val(),
    projectId: $("#add-todo-project").val()
  };

  axios({
    url: "/todos",
    method: "post",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") },
    data
  })
    .then(({ data }) => {
      resetAddTodo();
      hideAll();
      if (data.projectId) {
        detailProject(data.projectId);
      } else {
        goHome();
      }
    })
    .catch(err => {
      resetAddTodo();
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
});

function resetAddTodo() {
  $("#add-todo-name").val("");
  $("#add-todo-description").val("");
  $("#add-todo-date").val("");
  $("#add-todo-project").val("");
}

function deleteTodo(id, projectId) {
  axios({
    url: `/todos/${id}`,
    method: "delete",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") }
  })
    .then(_ => {
      if (projectId) detailProject(projectId);
      else goHome();
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}

function updateTodo(id, projectId) {
  axios({
    url: `/todos/${id}`,
    method: "patch",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") },
    data: {
      status: "done"
    }
  })
    .then(_ => {
      if (projectId) detailProject(projectId);
      else goHome();
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}
