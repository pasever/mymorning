$(document).ready(() => {
  setTimeout(popup, 1000);

  function popup() {
    $("#logindiv").css("display", "block");
  }

  $("#login #cancelbtn").click(function() {
    $(this).parent().parent().hide();
  });

  $("#send").click(function() {
    let name = $("#name").val();
    let email = $("#email").val();
    let contact = $("#contactno").val();
    let message = $("#message").val();
    if (name == "" || email == "" || contactno == "" || message == "") {
      alert("Please Fill All Fields");
    } else {
      if (validateEmail(email)) {
        $("#contactdiv").css("display", "none");
      } else {
        alert('Invalid Email Address');
      }

      function validateEmail(email) {
        let filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if (filter.test(email)) {
          return true;
        } else {
          return false;
        }
      }
    }
  });

  $("#loginbtn").click(function() {
    let name = $("#username").val();
    let password = $("#password").val();
    if (username == "" || password == "") {
      alert("Username or Password was Wrong");
    } else {
      $("#logindiv").css("display", "none");
    }
  });
});
