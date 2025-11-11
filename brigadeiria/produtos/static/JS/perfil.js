document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("loginSection");
  const registerBox = document.getElementById("registerSection");
  const btnToRegister = document.getElementById("btnToRegister");
  const btnToLogin = document.getElementById("btnToLogin");

  // === LOGIN / CADASTRO ===
  if (loginBox && registerBox) {
    function showLogin() {
      loginBox.classList.add("ativo");
      registerBox.classList.remove("ativo");
    }

    function showRegister() {
      registerBox.classList.add("ativo");
      loginBox.classList.remove("ativo");
    }

    if (btnToRegister) {
      btnToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        showRegister();
      });
    }

    if (btnToLogin) {
      btnToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        showLogin();
      });
    }

    showLogin();
  }

  // === LOGOUT MODAL ===
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.classList.add("show");
    });
  }

  if (cancelLogout && logoutModal) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.remove("show");
    });
  }

  // 🔹 Confirmar Logout
  if (confirmLogout) {
    confirmLogout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("cart");
      window.location.href = "/sair/";
    });
  }
});


