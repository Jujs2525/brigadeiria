document.addEventListener("DOMContentLoaded", async () => {

  /* ================= FUNÇÃO DE PREÇO POR CATEGORIA =============== */
  function precoPorCategoria(cat = "") {
    const c = (cat || "").toLowerCase();
    if (c.includes("premium")) return 1.80;
    if (c.includes("especial")) return 2.00;
    return 1.50;
  }

  /* ================= FUNÇÕES UTILITÁRIAS =============== */

  async function verificarLogin() {
    try {
      const r = await fetch("/verificar-login/");
      const data = await r.json();
      return data.autenticado;
    } catch {
      return false;
    }
  }

  async function salvarCarrinhoNoServidor(cart) {
    try {
      await fetch("/api/carrinho/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });
      console.log("Salvando carrinho no servidor:", cart);
    } catch (err) {
      console.error("Erro salvar servidor:", err);
      alert("Não foi possível salvar seu carrinho.");
    }
  }

  async function carregarCarrinhoDoServidor() {
    try {
      const r = await fetch("/api/carrinho/");
      if (!r.ok) return [];
      return await r.json();
    } catch (err) {
      console.error("Erro carregar servidor:", err);
      alert("Falha ao carregar seu carrinho.");
      return [];
    }
  }

  async function limparCarrinhoServidor() {
    try {
      await fetch("/api/carrinho/", { method: "DELETE" });
    } catch (err) {
      console.error("Erro ao limpar servidor:", err);
      alert("Erro ao limpar carrinho do servidor.");
    }
  }

  /* =========== SINCRONIZAÇÃO LOCAL ↔ SERVIDOR AO LOGAR ============= */
  const logado = await verificarLogin();
  let localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (logado) {
    const serverCart = await carregarCarrinhoDoServidor();
    if (localCart.length > 0) {
      await salvarCarrinhoNoServidor(localCart);
      localStorage.setItem("cart", JSON.stringify(localCart));
    } else {
      localStorage.setItem("cart", JSON.stringify(serverCart));
    }
  }

  localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  /* ========== CARREGAR E MANIPULAR CARRINHO NA TELA ========== */

  const itensEl = document.getElementById("card-itens-container");
  const totalEl = document.getElementById("card-total-value");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (itensEl) carregarCarrinho(itensEl, totalEl);

  // LIMPAR
  const limparBtn = document.getElementById("limpar-pedido");
  if (limparBtn) {
    limparBtn.onclick = async () => {
      localStorage.removeItem("cart");
      await limparCarrinhoServidor();
      alert("Carrinho limpo com sucesso!");
      location.reload();
    };
  }

  /* ================= FINALIZAR VIA WHATSAPP =============== */
  if (checkoutBtn) {
    checkoutBtn.onclick = async () => {
      const logado = await verificarLogin();

      if (!logado) {
        alert("Você precisa estar logado para finalizar o pedido!");
        window.location.href = "/perfil/";
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
      }

      let msg = "Olá! Segue meu pedido:\n\n";
      let total = 0;

      cart.forEach(prod => {
        const preco = precoPorCategoria(prod.category);
        const subtotal = preco * (prod.quantity || 25);
        total += subtotal;
        msg += `- ${prod.name} (${prod.category}): ${prod.quantity} unid. = R$ ${subtotal.toFixed(2)}\n`;
      });

      msg += `\nTotal: R$ ${total.toFixed(2)}`;

      const url = `https://wa.me/5515981453091?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");

      alert("Pedido enviado! Obrigado 💛");

      localStorage.removeItem("cart");
      await limparCarrinhoServidor();
    };
  }

  /* ================= REMOVE ITEM ================= */
  function carregarCarrinho(container, totalEl) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    console.log("Carrinho carregado:", cart);

    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = "<p>Seu carrinho está vazio.</p>";
      totalEl.textContent = "R$ 0,00";
      return;
    }

    cart.forEach((product, index) => {
      const precoUnit = precoPorCategoria(product.category);
      const subtotal = precoUnit * (product.quantity || 25);

      const item = document.createElement("div");
      item.classList.add("cart-item");
      item.innerHTML = `
        <span>${product.name}</span>

        <div class="quantidade-controle">
          <button class="menos">-</button>
          <input type="number" min="25" value="${product.quantity}">
          <button class="mais">+</button>
        </div>

        <div class="preco-container">
          <span class="preco">R$ ${subtotal.toFixed(2)}</span>
          <button class="remove-item">
            <img src="/static/src/lata-de-lixo.png" class="icon-trash">
          </button>
        </div>
      `;

      container.appendChild(item);

      const input = item.querySelector("input");
      const menos = item.querySelector(".menos");
      const mais = item.querySelector(".mais");
      const precoEl = item.querySelector(".preco");
      const removeBtn = item.querySelector(".remove-item");

      const atualizar = async () => {
        const qtd = Math.max(25, parseInt(input.value) || 25);
        cart[index].quantity = qtd;

        const newSubtotal = precoUnit * qtd;
        precoEl.textContent = `R$ ${newSubtotal.toFixed(2)}`;

        localStorage.setItem("cart", JSON.stringify(cart));
        await salvarCarrinhoNoServidor(cart);
        atualizarTotal();
        alert("Quantidade atualizada!");
      };

      mais.onclick = () => {
        input.value = parseInt(input.value) + 1;
        atualizar();
      };

      menos.onclick = () => {
        if (parseInt(input.value) > 25) {
          input.value = parseInt(input.value) - 1;
          atualizar();
        } else {
          alert("O pedido mínimo é 25 unidades!");
        }
      };

      input.onchange = atualizar;

      // Agora a função de remoção
      removeBtn.onclick = async () => {
        console.log("Remover item", product.name);
        cart.splice(index, 1); // Remove o item do array
        localStorage.setItem("cart", JSON.stringify(cart)); // Atualiza o localStorage
        console.log("Carrinho atualizado:", cart);

        await salvarCarrinhoNoServidor(cart); // Salva o carrinho atualizado no servidor
        alert("Item removido!");

        carregarCarrinho(container, totalEl); // Recarrega o carrinho após remoção
      };
    });

    atualizarTotal();

    function atualizarTotal() {
      let total = 0;
      cart.forEach(prod => {
        total += precoPorCategoria(prod.category) * (prod.quantity || 25);
      });
      totalEl.textContent = "R$ " + total.toFixed(2);
    }
  }

});
