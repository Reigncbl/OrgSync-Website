document.addEventListener('DOMContentLoaded', function() {
    const goToRegisterBtn = document.getElementById('go-to-register');
    const goToLoginBtn = document.getElementById('go-to-login');
  
    // Show the register form and hide the login form
    if (goToRegisterBtn) {
      goToRegisterBtn.addEventListener('click', function() {
        window.location.href = '/src/Client/scripts/register.html';
      });
    }
  
    // Show the login form and hide the register form
    if (goToLoginBtn) {
      goToLoginBtn.addEventListener('click', function() {
        window.location.href = '/src/Client/scripts/login.html';
      });
    }
  });
  