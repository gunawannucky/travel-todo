function fetchProjects() {
  axios({
    url: "/projects",
    method: "get",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") }
  })
    .then(({ data }) => {
      $("#project-list").empty();
      let { projects } = data;
      projects.forEach(project => {
        let card = `
                    <div class="card">
                        <div class="card-header">
                        ${project.name}
                        </div>
                        <div class="card-body">
                        <p>
                            ${project.description}
                        </p>                        
                        </div>
                        <div class="card-footer">
                        <div class="d-flex justify-content-between fw">
                        <button onclick="deleteProject('${project._id}')" class="btn btn-danger btn-sm">Delete</button>
                        
                        <button onclick="detailProject('${project._id}')" class="btn btn-info btn-sm">See Group</button>
                        </div>
                        </div>
                    </div>
                
            `;

        $("#project-list").append(card);
      });
    })
    .catch(err => {});
}

function goCreateProject() {
  hideAll();
  $("#post-projects-page").show();
}

$("#add-project-form").submit(function(event) {
  event.preventDefault();
  axios({
    url: "/projects",
    method: "post",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") },
    data: {
      name: $("#add-project-name").val() || undefined,
      description: $("#add-project-description").val() || undefined
    }
  })
    .then(({ data }) => {
      resetAddProject();
      goGroup();
    })
    .catch(err => {
      resetAddProject();
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
});

function resetAddProject() {
  $("#add-project-name").val("");
  $("#add-project-description").val("");
}

function deleteProject(id) {
  axios({
    url: `/projects/${id}`,
    method: "delete",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") }
  })
    .then(_ => {
      goGroup();
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}

function detailProject(id) {
  axios({
    url: `/projects/${id}`,
    method: "get",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") }
  })
    .then(({ data }) => {
      goDetailGroup(data);
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
}

$("#add-member-form").submit(function(event) {
  event.preventDefault();
  let id = $("#add-member-id").val();
  axios({
    url: `/projects/${id}/add-user`,
    method: "post",
    baseURL: $BASE_URL,
    headers: { token: localStorage.getItem("token") },
    data: {
      email: $("#add-member-email").val() || undefined
    }
  })
    .then(({ data }) => {
      $("#add-member-email").val("");
      detailProject(data._id);
    })
    .catch(err => {
      $("#add-member-email").val("");
      Swal.fire({
        type: "error",
        text: err.response.data.message[0]
      });
    });
});
