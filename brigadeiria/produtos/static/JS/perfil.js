document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("loginSection");
  const registerBox = document.getElementById("registerSection");
  const btnToRegister = document.getElementById("btnToRegister");
  const btnToLogin = document.getElementById("btnToLogin");

  function showLogin() {
    loginBox.classList.add("ativo");
    registerBox.classList.remove("ativo");
  }

  function showRegister() {
    registerBox.classList.add("ativo");
    loginBox.classList.remove("ativo");
  }

  btnToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });

  btnToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  showLogin(); // começa com login visível
});
