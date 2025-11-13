document.addEventListener("DOMContentLoaded", () => {

    // Sempre vem como string → converter para número
    let timeRemaining = parseInt(window.ADMIN_TIME_REMAINING);

    // Se não houver tempo → não exibe nada
    if (isNaN(timeRemaining) || timeRemaining <= 0) return;

    const alertBox = document.getElementById("admin-expire-alert");
    if (!alertBox) return;

    alertBox.style.display = "block";

    // Atualiza pela primeira vez
    alertBox.innerText = `Sua sessão irá expirar em ${timeRemaining} segundos.`;

    const countdown = setInterval(() => {

        timeRemaining--;

        // Quando expira
        if (timeRemaining <= 0) {
            clearInterval(countdown);

            alertBox.innerText = "Sua sessão expirou.";

            // Remover o cookie da sessão do admin
            document.cookie = "admin_sessionid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

            // Redirecionar para a tela de login do admin
            setTimeout(() => {
                window.location.href = "/admin/login/?next=/admin/";
            }, 1200);

            return;
        }

        // Atualiza o texto normal
        alertBox.innerText = `Sua sessão irá expirar em ${timeRemaining} segundos.`;

    }, 1000);
});
