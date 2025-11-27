document.addEventListener("DOMContentLoaded", () => {

    /* EDITAR PERFIL */
    const viewMode = document.getElementById("viewMode");
    const editMode = document.getElementById("editMode");
    const btnEditar = document.getElementById("btnEditarPerfil");
    const btnCancelar = document.getElementById("btnCancelarEdicao");

    if (viewMode && editMode) {
        editMode.style.display = "none"; // começa escondido
        viewMode.style.display = "block";
    }

    if (btnEditar) {
        btnEditar.addEventListener("click", () => {
            viewMode.style.display = "none";
            editMode.style.display = "flex";   // Modo de edição em flex
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editMode.style.display = "none";
            viewMode.style.display = "block";  // Retorna ao modo de visualização
        });
    }

    /* ============================
       LOGIN / CADASTRO
    ============================ */
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
            btnToRegister.addEventListener("click", e => {
                e.preventDefault();
                showRegister();
            });
        }

        if (btnToLogin) {
            btnToLogin.addEventListener("click", e => {
                e.preventDefault();
                showLogin();
            });
        }

        showLogin();
    }

    /* ============================
       LOGOUT
    ============================ */
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const cancelLogout = document.getElementById("cancelLogout");

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener("click", () => {
            logoutModal.classList.add("show");
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener("click", () => {
            logoutModal.classList.remove("show");
        });
    }

    /* ============================
       DELETE ACCOUNT
    ============================ */
    const deleteBtn = document.getElementById("deleteAccountBtn");
    const deleteModal = document.getElementById("deleteModal");
    const cancelDelete = document.getElementById("cancelDelete");

    if (deleteBtn && deleteModal) {
        deleteBtn.addEventListener("click", () => {
            deleteModal.classList.add("show");
        });
    }

    if (cancelDelete) {
        cancelDelete.addEventListener("click", () => {
            deleteModal.classList.remove("show");
        });
    }

    /* ============================
       FUNÇÃO GENÉRICA DE BUSCA
    ============================ */
    function buscarCEP(cep, callback) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(r => r.json())
            .then(data => {
                if (!data.erro) {
                    callback(null, data);
                } else {
                    callback("CEP inválido");
                }
            })
            .catch(() => {
                callback("Falha ao conectar ao ViaCEP");
            });
    }

    /* ============================
        CEP — CADASTRO
    ============================ */
    const cepCadastro = document.getElementById("cep");
    const enderecoCadastro = document.getElementById("endereco");

    if (cepCadastro) {
        cepCadastro.addEventListener("blur", () => {
            const cep = cepCadastro.value.replace(/\D/g, "");
            if (cep.length === 8) {
                buscarCEP(cep, (erro, data) => {
                    if (!erro) {
                        enderecoCadastro.value =
                            `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                });
            }
        });
    }

    /* ============================
        CEP — EDITAR PERFIL
    ============================ */
    const cepEdit = document.getElementById("cepEdit");
    const enderecoEdit = document.getElementById("enderecoEdit");

    if (cepEdit) {
        cepEdit.addEventListener("blur", () => {
            const cep = cepEdit.value.replace(/\D/g, "");
            if (cep.length === 8) {
                buscarCEP(cep, (erro, data) => {
                    if (!erro) {
                        enderecoEdit.value =
                            `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                });
            }
        });
    }

    // Seleciona todos os inputs do formulário de cadastro
    const inputs = document.querySelectorAll("#registerSection form input");

    // Para cada input, adicionamos o comportamento desejado
    inputs.forEach((input, index) => {
        input.addEventListener("keydown", function (e) {

            // Se apertou ENTER
            if (e.key === "Enter") {
                e.preventDefault(); // impede submit automático

                const nextInput = inputs[index + 1];

                // Se existe um próximo input → foca nele
                if (nextInput) {
                    nextInput.focus();
                }
                // Se NÃO existe (último input) → não faz nada
            }
        });
    });


});