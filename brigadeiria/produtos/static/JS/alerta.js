// 🔔 ALERTA GLOBAL UNIVERSAL
// Funciona em QUALQUER página do site

window.showAlert = function (message, type = "error") {
    const container = document.getElementById("global-alerts");
    if (!container) {
        console.error("⚠ ERRO: div#global-alerts não encontrada no HTML.");
        return;
    }

    // cria alerta
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.textContent = message;

    // adiciona ao container
    container.appendChild(div);

    // tempo para sumir com animação
    setTimeout(() => {
        div.classList.add("hide");
        setTimeout(() => div.remove(), 500);
    }, 3500);
};
