window.showAlert = function (message, type = "success") {
    const container = document.getElementById("global-alerts");
    if (!container) return;

    container.innerHTML = ""; // remove alertas antigos

    const alert = document.createElement("div");
    alert.classList.add("msg", type);
    alert.textContent = message;

    container.appendChild(alert);

    setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitionend", () => alert.remove());
    }, 2500);
};
