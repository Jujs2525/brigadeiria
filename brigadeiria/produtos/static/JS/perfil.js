document.addEventListener("DOMContentLoaded", () => {
    // ====== CEP AUTOMÁTICO ======
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");

    // Função para preencher o endereço automaticamente ao colocar o CEP
    cepInput.addEventListener("blur", () => {
        const cep = cepInput.value.replace(/\D/g, ""); // Remove qualquer não-dígito

        if (cep.length === 8) {
            // Realiza a consulta da API dos Correios para obter o endereço
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    } else {
                        alert("CEP não encontrado.");
                    }
                })
                .catch(error => alert("Erro ao buscar CEP: " + error));
        }
    });

    // ====== LOGIN / CADASTRO ======
    const loginBox = document.getElementById("loginSection");
    const registerBox = document.getElementById("registerSection");
    const btnToRegister = document.getElementById("btnToRegister");
    const btnToLogin = document.getElementById("btnToLogin");

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

    // ====== LOGOUT MODAL ======
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

    if (confirmLogout) {
        confirmLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("cart");
            window.location.href = "/sair/";
        });
    }

    // ====== DELETAR CONTA ======
    const deleteBtn = document.getElementById("deleteAccountBtn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            if (confirm("Tem certeza que deseja excluir sua conta? Isso não poderá ser desfeito.")) {
                window.location.href = "/excluir-conta/";
            }
        });
    }

    // ====== VALIDAR CONFIRMAÇÃO DE SENHA ======
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
                return;
            }
        });
    }

    // ====== MODOS DE EDIÇÃO ======
    const btnEditar = document.getElementById("btnEditarPerfil");
    const btnCancelar = document.getElementById("btnCancelarEdicao");

    const viewMode = document.getElementById("viewMode");
    const editMode = document.getElementById("editMode");

    if (btnEditar) {
        btnEditar.addEventListener("click", () => {
            viewMode.style.display = "none";
            editMode.style.display = "flex";
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editMode.style.display = "none";
            viewMode.style.display = "block";
        });
    }
});
