document.addEventListener("DOMContentLoaded", () => {

    /* EDITAR PERFIL */
    const viewMode = document.getElementById("viewMode");
    const editMode = document.getElementById("editMode");
    const btnEditar = document.getElementById("btnEditarPerfil");
    const btnCancelar = document.getElementById("btnCancelarEdicao");

    if (viewMode && editMode) {
        editMode.style.display = "none";
        viewMode.style.display = "block";
    }

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

    /* ============================
       VALIDAÇÃO CAMPOS – EDITAR PERFIL
    ============================ */
    const editForm = document.querySelector("#editMode form");
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            const requiredInputs = editForm.querySelectorAll("input[required]");
            let valid = true;

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.setCustomValidity("Este campo é obrigatório.");
                } else {
                    input.setCustomValidity("");
                }
            });

            if (!valid) {
                e.preventDefault();
                showAlert("Por favor, preencha todos os campos obrigatórios.", "error");
            }
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
    VALIDAÇÃO SENHAS — ABAIXO DO CAMPO
    ============================ */
    const senhaInput = document.querySelector("#registerSection input[name='senha']");
    const confirmarSenhaInput = document.querySelector("#registerSection input[name='confirmarSenha']");

    if (senhaInput && confirmarSenhaInput) {

        let msg = document.querySelector("#senha-mensagem");

        if (!msg) {
            msg = document.createElement("div");
            msg.id = "senha-mensagem";
            msg.className = "msg error small-alert until-correct";
            msg.style.display = "none";
            confirmarSenhaInput.insertAdjacentElement("afterend", msg);
        }

        const validar = () => {
            // Se um dos campos estiver vazio → não mostrar nada
            if (senhaInput.value === "" || confirmarSenhaInput.value === "") {
                msg.style.display = "none";
                return;
            }

            if (senhaInput.value !== confirmarSenhaInput.value) {
                msg.textContent = "As senhas não coincidem.";
                msg.style.display = "block";
            } else {
                msg.style.display = "none"; // Só some quando estiver igual
            }
        };

        // ⭐ Mudança aqui: antes era "input"
        senhaInput.addEventListener("blur", validar);
        confirmarSenhaInput.addEventListener("blur", validar);
    }

    /* ============================
       IMPEDIR ENVIO SE SENHA NÃO BATER
    ============================ */
    const formularioCadastroSenha = document.querySelector("#registerSection form");

    if (formularioCadastroSenha && senhaInput && confirmarSenhaInput) {
        formularioCadastroSenha.addEventListener("submit", (e) => {
            if (senhaInput.value !== confirmarSenhaInput.value) {
                e.preventDefault();
                showAlert("As senhas não coincidem.", "error");
            }
        });
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
       VIACEP – FUNÇÃO
    ============================ */
    function buscarCEP(cep, callback) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(r => r.json())
            .then(data => {
                if (!data.erro) callback(null, data);
                else callback("CEP inválido");
            })
            .catch(() => callback("Falha ao conectar ao ViaCEP"));
    }

    /* ============================
       CEP CADASTRO
    ============================ */
    const cepCadastro = document.getElementById("cep");
    const enderecoCadastro = document.getElementById("endereco");

    if (cepCadastro) {
        cepCadastro.addEventListener("blur", () => {
            const cep = cepCadastro.value.replace(/\D/g, "");
            if (cep.length === 8) {
                buscarCEP(cep, (erro, data) => {
                    if (!erro) {
                        enderecoCadastro.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                });
            }
        });
    }

    /* ============================
       CEP EDITAR PERFIL
    ============================ */
    const cepEdit = document.getElementById("cepEdit");
    const enderecoEdit = document.getElementById("enderecoEdit");

    if (cepEdit) {
        cepEdit.addEventListener("blur", () => {
            const cep = cepEdit.value.replace(/\D/g, "");
            if (cep.length === 8) {
                buscarCEP(cep, (erro, data) => {
                    if (!erro) {
                        enderecoEdit.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                });
            }
        });
    }

    /* ============================
       INPUTS OBRIGATÓRIOS (GENÉRICO)
    ============================ */
    const inputs = document.querySelectorAll("input[required]");

    inputs.forEach(input => {
        input.addEventListener("invalid", function () {
            if (this.value === "") {
                this.setCustomValidity("Este campo é obrigatório.");
            }
        });

        input.addEventListener("input", function () {
            this.setCustomValidity("");
        });
    });

    /* ============================
    BLOQUEAR CADASTRO SE FALTAR ALGO
    ============================ */
    const formularioCadastro = document.querySelector("#registerSection form");
    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", (e) => {

            const requiredInputs = formularioCadastro.querySelectorAll("input[required]");
            let empty = false;

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    empty = true;
                }
            });

            if (empty) {
                e.preventDefault();
                showAlert("Por favor, preencha todos os campos obrigatórios.", "error");
            }

        });
    }


    /* ============================
       BLOQUEAR LOGIN SE FALTAR ALGO
    ============================ */
    const loginForm = document.querySelector("#loginSection form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            const invalidInputs = loginForm.querySelectorAll("input[required]:invalid");

            if (invalidInputs.length > 0) {
                e.preventDefault();
                showAlert("Por favor, preencha todos os campos obrigatórios.", "error");
            }
        });
    }

    /* ==========================================
    IMPEDIR QUE ENTER ENVIE O FORMULÁRIO
    ========================================== */
    const formCadastroEnter = document.querySelector("#registerSection form");

    if (formCadastroEnter) {
        formCadastroEnter.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                // se for required e estiver vazio, não avança
                if (e.target.hasAttribute("required") && !e.target.value.trim()) {
                    e.target.reportValidity(); // mostra a mensagem de campo obrigatório
                    return;
                }

                const form = e.target.form;
                const index = Array.prototype.indexOf.call(form, e.target);
                form.elements[index + 1]?.focus();
            }
        });
    }

    /* ============================
    MÁSCARA DE TELEFONE
    ============================ */
    function maskPhone(value) {
        return value
            .replace(/\D/g, "")                     // remove tudo que não é número
            .replace(/^(\d{2})(\d)/, "($1) $2")     // (11) 9...
            .replace(/(\d{5})(\d)/, "$1-$2")        // 98765-4321
            .slice(0, 15);
    }

    /* Aplica a máscara nos campos corretos */
    const phoneInputs = document.querySelectorAll("input[name='telefone'], input[name='telefoneEdit']");
    phoneInputs.forEach(input => {
        input.addEventListener("input", e => {
            e.target.value = maskPhone(e.target.value);
        });
    });


    /* ============================
    MÁSCARA DE CEP
    ============================ */
    function maskCEP(value) {
        return value
            .replace(/\D/g, "")               // remove não números
            .replace(/(\d{5})(\d)/, "$1-$2")  // 12345-678
            .slice(0, 9);
    }

    const cepInputs = document.querySelectorAll("#cep, #cepEdit");
    cepInputs.forEach(input => {
        input.addEventListener("input", e => {
            e.target.value = maskCEP(e.target.value);
        });
    });

    /* ============================
    SENHAS VISÍVEIS 
    // Pega TODOS os campos de senha que usam o mesmo ID
    const inputsSenha = document.querySelectorAll("#passwordInput");
    const iconesOlho = document.querySelectorAll("#eyeClosed");

    iconesOlho.forEach((icone, index) => {
        const input = inputsSenha[index];

        icone.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text"; // 👉 mostra a senha
                icone.src = "/static/src/eyeOpen.png"; // olho ABERTO
            } else {
                input.type = "password"; // 👉 esconde novamente
                icone.src = "/static/src/eyeClosed.png"; // olho FECHADO
            }
        });
    });
    ============================ */
});

document.querySelectorAll(".passwordInput").forEach(container => {
    const input = container.querySelector("input");
    const eye = container.querySelector(".eyeToggle");

    eye.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        eye.src = isPassword 
            ? eye.src.replace("eyeClosed", "eyeOpen")
            : eye.src.replace("eyeOpen", "eyeClosed");
    });
});

