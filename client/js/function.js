function goHome() {
  if (!localStorage.getItem("token")) {
    hideAll();
    $("#landing-page").show();
  } else {
    hideAll();
    $("#get-todos-page").show();
    fetchTodos();
  }
}

function hideAll() {
  $("#landing-page").hide();
  $("#login-page").hide();
  $("#register-page").hide();

  $("#get-todos-page").hide();
  $("#post-todos-page").hide();
  $("#get-projects-page").hide();
  $("#post-projects-page").hide();
  $("#get-projects-id-page").hide();
}

//reset login form
function resetLogin() {
  $("#login-email").val("");
  $("#login-password").val("");
}

//reset register form
function resetRegister() {
  $("#reg-name").val("");
  $("#reg-email").val("");
  $("#reg-password").val("");
}

$(".datepicker").datepicker({
  format: "yyyy,mm,dd",
  autoclose: true,
  todayHighlight: true
});

function goGroup() {
  hideAll();
  $("#get-projects-page").show();
  fetchProjects();
}

function exitGroup(id) {
  axios({
    url: `/projects/${id}/exit`,
    method: "get",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") },
    data: {
      email: $("#add-member-email").val() || undefined
    }
  })
    .then(({ data }) => {
      goGroup();
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}

function goDetailGroup(data) {
  hideAll();
  $("#get-projects-id-page").show();
  $("#group-todo-list").empty();

  let liUser = "";
  let { users } = data;
  users.forEach(user => {
    liUser += `
      <li>${user.email}</li>
    `;
  });
  $("#list-user").empty();
  $("#list-user").append(liUser);

  let exitBtn = `
    <button class="btn btn-danger fw" onclick="exitGroup('${data._id}')">Exit Group</button>
  `;
  $("#containExit").empty();
  $("#containExit").append(exitBtn);

  let inputId = `
    <input type="hidden" id="add-member-id" value="${data._id}">
  `;
  $("#containId").empty();
  $("#containId").append(inputId);

  let btnAdd = `
    <button onclick="goCreateTodo('${data._id}')" class="btn btn-primary">Add Group Destination</button>
  `;
  $("#containBtn").empty();
  $("#containBtn").append(btnAdd);

  let { todos } = data;
  todos.forEach(todo => {
    todo.dueDate = new Date(todo.dueDate);
    let doneBtn = "";
    if (todo.status === "undone") {
      doneBtn = `
                <button onclick="updateTodo('${todo._id}', '${todo.projectId}')" class="btn btn-primary btn-sm">Done it</button>
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
                        
                        <button onclick="deleteTodo('${todo._id}', '${
      todo.projectId
    }')" class="btn btn-danger btn-sm">Delete</button>
                        
                        ${doneBtn}
                        </div>
                        </div>
                    </div>
                
            `;

    $("#group-todo-list").append(card);
  });
}
