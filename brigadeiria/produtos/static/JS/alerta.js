window.showAlert = function (message, type = "success") {
    const container = document.getElementById("global-alerts");

    // 🔥 Remove alertas antigos antes de exibir o novo
    container.innerHTML = "";

    const alert = document.createElement("div");
    alert.classList.add("msg", type);
    alert.textContent = message;

    container.appendChild(alert);

    // Remove depois de 2.5s com fade
    setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitionend", () => alert.remove());
    }, 2500);
};
