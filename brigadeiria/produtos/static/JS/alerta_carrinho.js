document.addEventListener("DOMContentLoaded", async () => {
  // Carregar o carrinho do localStorage
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  // Selecionar todos os botões de remoção
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((removeBtn, index) => {
    removeBtn.onclick = async () => {
      const product = cart[index];  // Pega o produto correto do carrinho
      console.log("Remover item", product.name);

      // Remove o item do carrinho
      cart.splice(index, 1); 
      localStorage.setItem("cart", JSON.stringify(cart)); // Atualiza o localStorage

      console.log("Carrinho atualizado:", cart);

      // Salva o carrinho atualizado no servidor
      await salvarCarrinhoNoServidor(cart); 

      // Exibe o alerta de sucesso
      showAlert("Item removido!", "success"); 

      // Recarrega o carrinho após remoção
      carregarCarrinho(container, totalEl); 
    };
  });
});

// Função de exibição de alerta
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById("alert-container");

  // Cria um novo alerta
  const newAlert = document.createElement("div");
  newAlert.classList.add("msg", type);
  newAlert.textContent = message;

  // Adiciona o alerta ao container
  alertContainer.appendChild(newAlert);

  // Remove o alerta após 4 segundos
  setTimeout(() => {
    alertContainer.removeChild(newAlert);
  }, 4000); // 4 segundos no total para o efeito
}
