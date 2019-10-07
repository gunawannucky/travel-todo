//logout
$(".logout").click(event => {
  event.preventDefault();
  if (gapi.auth2) {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      localStorage.removeItem("token");
      hideAll();
      $("#landing-page").show();
    });
  } else {
    localStorage.removeItem("token");
    goHome();
  }
});

//register form
$("#register-form").submit(function(event) {
  event.preventDefault();
  $.ajax({
    method: "post",
    url: `${$BASE_URL}/users/register`,
    data: {
      name: $("#reg-name").val(),
      email: $("#reg-email").val(),
      password: $("#reg-password").val()
    }
  })
    .done(data => {
      resetRegister();
      localStorage.setItem("token", data.token);
      goHome();
    })
    .fail(err => {
      resetRegister();
      Swal.fire({
        type: "error",
        text: err.responseJSON.message
      });
    });
});

//login form
$("#login-form").submit(function(event) {
  event.preventDefault();
  $.ajax({
    method: "post",
    url: `${$BASE_URL}/users/login`,
    data: {
      email: $("#login-email").val(),
      password: $("#login-password").val()
    }
  })
    .done(data => {
      resetLogin();
      localStorage.setItem("token", data.token);
      goHome();
    })
    .fail(err => {
      resetLogin();
      Swal.fire({
        type: "error",
        text: err.responseJSON.message
      });
    });
});

//google sign in
function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "post",
    url: `${$BASE_URL}/users/googleSignIn`,
    headers: {
      id_token
    }
  })
    .done(data => {
      resetLogin();
      localStorage.setItem("token", data.token);
      goHome();
    })
    .fail(err => {
      resetLogin();
      Swal.fire({
        type: "error",
        text: err.responseJSON.message
      });
    });
}
