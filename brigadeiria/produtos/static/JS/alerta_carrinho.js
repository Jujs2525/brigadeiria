function showAlert(message, type = 'success'){
    const alertContainer = document.getElementById("alert-container");

    //Cria - novo alerta
    const newAlert = document.createElement("div");
    newAlert.classList.add("msg", type);
    newAlert.textContent = message;

    //Adiciona alerta 
    alertContainer.appendChild(newAlert);

    //Remove o alerta
    setTimeout(() => {
        alertContainer.removeChild(newAlert);
    }, 4000); // 4 segundos no total para o efeito
    }

    // Substitua `alert()` por `showAlert()` no código de remoção do carrinho
    document.addEventListener("DOMContentLoaded", async () => {

    // Função de remover item no carrinho
    removeBtn.onclick = async () => {
        console.log("Remover item", product.name);
        cart.splice(index, 1); // Remove o item do array
        localStorage.setItem("cart", JSON.stringify(cart)); // Atualiza o localStorage
        console.log("Carrinho atualizado:", cart);

        await salvarCarrinhoNoServidor(cart); // Salva o carrinho atualizado no servidor
        showAlert("Item removido!", "success"); // Mostra a mensagem de sucesso

        carregarCarrinho(container, totalEl); // Recarrega o carrinho após remoção
    };
});