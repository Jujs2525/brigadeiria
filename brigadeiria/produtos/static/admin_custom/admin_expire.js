document.addEventListener("DOMContentLoaded", () => {
    const timeRemaining = parseInt(window.ADMIN_TIME_REMAINING);

    const WARNING_TIME = 20; // PARA TESTE – depois troque para 300 (5 min)

    if (timeRemaining > 0 && timeRemaining <= WARNING_TIME) {
        const alertBox = document.getElementById("admin-expire-alert");
        if (!alertBox) return;

        alertBox.style.display = "block";

        let secondsLeft = Math.floor(timeRemaining);

        alertBox.innerText = `Sua sessão irá expirar em ${secondsLeft} segundos.`;

        setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
                alertBox.innerText = "Sua sessão expirou.";
            } else {
                alertBox.innerText = `Sua sessão irá expirar em ${secondsLeft} segundos.`;
            }
        }, 1000);
    }
});
