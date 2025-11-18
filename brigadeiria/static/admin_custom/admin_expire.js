document.addEventListener("DOMContentLoaded", () => {

    let timeRemaining = parseInt(window.ADMIN_TIME_REMAINING);

    // ❌ Se não houver tempo → não faz nada
    if (isNaN(timeRemaining) || timeRemaining <= 0) return;

    const alertBox = document.getElementById("admin-expire-alert");
    const expireText = document.getElementById("expire-text");
    const btnRenew = document.getElementById("btn-renew");
    const btnLogout = document.getElementById("btn-logout");

    const WARNING_TIME = 30; // mostrar aviso quando faltar 30s — pode mudar

    // Começa escondido
    alertBox.style.display = "none";

    // ⏱ contador
    const interval = setInterval(() => {

        timeRemaining--;

        // 🤫 Não mostrar alerta ainda
        if (timeRemaining > WARNING_TIME) return;

        // 🟥 Mostrar quando faltar pouco tempo
        if (alertBox.style.display === "none") {
            alertBox.style.display = "block";
        }

        // Atualiza texto do alerta
        expireText.innerText = `Sua sessão irá expirar em ${timeRemaining} segundos.`;

        // ⛔ Expirou
        if (timeRemaining <= 0) {
            clearInterval(interval);
            expireText.innerText = "Sua sessão expirou.";

            // remove cookie e redireciona
            setTimeout(() => {
                document.cookie = "admin_sessionid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                window.location.href = "/admin/login/";
            }, 1200);
        }

    }, 1000);


    // 🟢 CONTINUAR LOGADO
    btnRenew?.addEventListener("click", async () => {
        expireText.innerText = "Renovando sessão...";

        try {
            await fetch("/admin/", { method: "GET", cache: "no-store" });
        } catch {}

        alertBox.style.display = "none";

        // Reseta tempo total
        timeRemaining = window.ADMIN_SESSION_DURATION || 300;
    });

    // 🔴 SAIR AGORA
    btnLogout.addEventListener("click", () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/admin/logout/";
        
        // Token CSRF obrigatório
        const csrf = document.querySelector("[name=csrfmiddlewaretoken]");
        if (csrf) {
            const token = document.createElement("input");
            token.type = "hidden";
            token.name = "csrfmiddlewaretoken";
            token.value = csrf.value;
            form.appendChild(token);
        }

        document.body.appendChild(form);
        form.submit();
    });
});
