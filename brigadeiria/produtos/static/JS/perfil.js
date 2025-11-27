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
    VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS NO EDITAR PERFIL
    ============================*/

    const editForm = document.querySelector("#editMode");
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            const requiredInputs = editForm.querySelectorAll("input[required]");
            let valid = true;

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.setCustomValidity("Este campo é obrigatório.");
                } else {
                    input.setCustomValidity(""); // Limpa qualquer erro anterior
                }
            });

            if (!valid) {
                e.preventDefault(); // Impede o envio do formulário caso algum campo obrigatório esteja vazio
                alert("Por favor, preencha todos os campos obrigatórios.");
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
    VALIDAÇÃO DE SENHAS

    const senhaInput = document.querySelector("input[name='senha']");
    const confirmarSenhaInput = document.querySelector("input[name='confirmarSenha']");
    const mensagemErro = document.createElement("div");
    mensagemErro.style.color = "red";
    mensagemErro.style.fontSize = "12px";
    mensagemErro.style.display = "none";  // Começa escondido

    if (confirmarSenhaInput) {
        confirmarSenhaInput.parentElement.appendChild(mensagemErro); // Adiciona a mensagem de erro após o campo de confirmar senha
        
        // Função para verificar as senhas
        const verificarSenhas = () => {
            if (senhaInput && confirmarSenhaInput) {
                if (senhaInput.value !== confirmarSenhaInput.value) {
                    mensagemErro.textContent = "As senhas não coincidem.";
                    mensagemErro.style.display = "block"; // Exibe a mensagem
                } else {
                    mensagemErro.style.display = "none"; // Esconde a mensagem
                }
            }
        };

        // Verifica sempre que o usuário digitar algo nas senhas
        senhaInput.addEventListener("input", verificarSenhas);
        confirmarSenhaInput.addEventListener("input", verificarSenhas);
    }

    /* ============================ 
    IMPEDIR ENVIO DE FORMULÁRIO CASO SENHAS NÃO COINCIDAM

    const formularioCadastro = document.querySelector("form"); // O formulário de cadastro
    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", (e) => {
            if (senhaInput.value !== confirmarSenhaInput.value) {
                e.preventDefault(); // Impede o envio do formulário
                alert("As senhas não coincidem. Corrija e tente novamente.");
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

    /* ============================
        INPUTS OBRIGATÓRIOS
    ============================ */
    // Seleciona todos os inputs do formulário que são obrigatórios
    const inputs = document.querySelectorAll("input[required]");

    // Para cada input, adicionamos o comportamento desejado
    inputs.forEach(input => {
        // Quando o campo for inválido (não preenchido), exibe a mensagem personalizada
        input.addEventListener("invalid", function () {
            if (this.value === "") {
                this.setCustomValidity("Este campo é obrigatório."); // Mensagem personalizada
            }
        });

        // Quando o campo for preenchido corretamente, limpa a mensagem de erro
        input.addEventListener("input", function () {
            this.setCustomValidity(""); // Limpa a mensagem de erro quando o campo for preenchido
        });
    });

    // Agora, se o formulário for enviado com algum campo obrigatório vazio, o envio será bloqueado
    const formularioCadastro = document.querySelector("form"); 
    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", (e) => {
            const invalidInputs = document.querySelectorAll("input[required]:invalid");
            if (invalidInputs.length > 0) {
                e.preventDefault(); 
                alert("Por favor, preencha todos os campos obrigatórios.");
            }
        });
    }

    // Validar campos obrigatórios na página de login
    const loginForm = document.querySelector("#loginSection form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            const invalidInputs = loginForm.querySelectorAll("input[required]:invalid");

            if (invalidInputs.length > 0) {
                e.preventDefault(); // Impede o envio do formulário
                alert("Por favor, preencha todos os campos obrigatórios.");
            }
        });
    }
});