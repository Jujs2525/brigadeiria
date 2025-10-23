document.addEventListener('DOMContentLoaded', () => {
  // Ativa o carrinho se estiver na página do carrinho
  const itensEl = document.getElementById('card-itens-container');
  if (itensEl) {
    const totalEl = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(itensEl, totalEl, checkoutBtn);
  }

  // Ativa o botão de limpar carrinho
  const limparBtn = document.getElementById('limpar-pedido');
  if (limparBtn) {
    limparBtn.addEventListener('click', () => {
      localStorage.removeItem('cart');
      location.reload();
    });
  }

  // Ativa o adicionar ao carrinho nos botões renderizados pelo Django
  const botoes = document.querySelectorAll('.adicionar-carrinho');
  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const category = btn.dataset.category;
      const priceUnit = Number(btn.dataset.price);

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let item = cart.find(p => p.name === name && p.category === category);

      if (item) {
        item.quantity += 1;
      } else {
        item = { name, category, priceUnit, quantity: 25 };
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} adicionado! Quantidade: ${item.quantity}`);
    });
  });
});

/* ---------- CARRINHO ---------- */
function carregarCarrinho(cardItensContainer, cardTotalValue, checkoutBtn) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  // 🔹 Tabela de preços fixos por categoria
  const tabelaPrecos = {
    "brigadeiro gourmet": 1.50,
    "brigadeiro gourmet premium": 1.80,
    "brigadeiro especial": 2.00
  };

  if (cart.length > 0) {
    cardItensContainer.innerHTML = "";

    cart.forEach((product, index) => {
      const categoria = (product.category || '').toLowerCase().trim();

      // 🔹 Seleciona preço da categoria
      const precoUnitario = tabelaPrecos[categoria] || 1.50; // padrão: gourmet
      const quantidade = product.quantity || 25;
      const subtotal = precoUnitario * quantidade;
      total += subtotal;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');

      cartItem.innerHTML = `
        <span>${product.name} <small>(${product.category})</small></span>
        <div class="quantidade-controle">
          <button class="menos">-</button>
          <input type="number" min="25" value="${quantidade}">
          <button class="mais">+</button>
        </div>
        <div class="preco-container">
          <span class="preco">R$ ${subtotal.toFixed(2)}</span>
          <button class="remove-item" title="Remover item">
            <img src="/static/src/lata-de-lixo.png" alt="Remover" class="icon-trash">
          </button>
        </div>
      `;

      // === Controles de quantidade ===
      const input = cartItem.querySelector('input');
      const menos = cartItem.querySelector('.menos');
      const mais = cartItem.querySelector('.mais');
      const precoEl = cartItem.querySelector('.preco');

      const atualizarPreco = () => {
        const qtd = Math.max(25, parseInt(input.value) || 25);
        product.quantity = qtd;
        const novoSubtotal = precoUnitario * qtd;
        precoEl.textContent = `R$ ${novoSubtotal.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        atualizarTotal();
      };

      menos.addEventListener('click', () => {
        if (input.value > 25) {
          input.value--;
          atualizarPreco();
        }
      });

      mais.addEventListener('click', () => {
        input.value++;
        atualizarPreco();
      });

      input.addEventListener('change', atualizarPreco);

      // Botão de remover item individual
      const removeBtn = cartItem.querySelector('.remove-item');
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        carregarCarrinho(cardItensContainer, cardTotalValue, checkoutBtn);
      });

      cardItensContainer.appendChild(cartItem);
    });
  } else {
    cardItensContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }

  atualizarTotal();

  // 🔹 Função que recalcula o total geral
  function atualizarTotal() {
    const novoCart = JSON.parse(localStorage.getItem('cart')) || [];
    let novoTotal = 0;

    novoCart.forEach(prod => {
      const categoria = (prod.category || '').toLowerCase().trim();
      const preco = tabelaPrecos[categoria] || 1.50;
      novoTotal += preco * (prod.quantity || 25);
    });

    cardTotalValue.textContent = `R$ ${novoTotal.toFixed(2)}`;
  }

  // 🔹 Botão de finalizar via WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const numeroWhatsApp = '5515981453091';
      let mensagem = 'Olá! Segue meu pedido:\n\n';
      cart.forEach(product => {
        const categoria = (product.category || '').toLowerCase().trim();
        const preco = tabelaPrecos[categoria] || 1.50;
        const subtotal = preco * (product.quantity || 25);
        mensagem += `- ${product.name} (${product.category}): ${product.quantity || 25} unid. = R$ ${subtotal.toFixed(2)}\n`;
      });
      mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, '_blank');
      localStorage.removeItem('cart');
    });
  }
}
