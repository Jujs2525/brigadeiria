document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("loginSection");
  const registerBox = document.getElementById("registerSection");
  const btnToRegister = document.getElementById("btnToRegister");
  const btnToLogin = document.getElementById("btn-login");

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

// === VALIDAR CONFIRMAÇÃO DE SENHA ===
const registerForm = document.querySelector("#registerSection form");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    const senha = registerForm.querySelector("input[name='senha']");
    const confirmar = registerForm.querySelector("input[name='confirmarSenha']");

    // remove mensagem antiga
    const oldMsg = registerForm.querySelector(".erro-senha");
    if (oldMsg) oldMsg.remove();

    // impede envio se forem diferentes
    if (senha.value.trim() !== confirmar.value.trim()) {
      e.preventDefault();
      const msg = document.createElement("p");
      msg.textContent = "⚠️ As senhas não coincidem.";
      msg.classList.add("erro-senha");
      msg.style.color = "#d33";
      msg.style.marginTop = "5px";
      msg.style.fontSize = "0.9rem";
      confirmar.insertAdjacentElement("afterend", msg);
      confirmar.focus();
      return; // <-- evita continuar
    }

    // 🔹 se as senhas forem iguais, aí sim envia normalmente
  });
}






