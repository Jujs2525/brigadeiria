document.addEventListener('DOMContentLoaded', () => {
  // Página do cardápio?
  if (document.querySelector('.produto-grid')) {
    fetchCardapio();
  }

  // Página do carrinho?
  const itensEl = document.getElementById('card-itens-container');
  if (itensEl) {
    const totalEl = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(itensEl, totalEl, checkoutBtn);
  }

  // Limpar
  const limparBtn = document.getElementById('limpar-pedido');
  if (limparBtn) {
    limparBtn.addEventListener('click', () => {
      localStorage.removeItem('cart');
      location.reload();
    });
  }
});

/* ---------- PREÇOS POR CATEGORIA ---------- */
function precoPorCategoria(nomeCategoria = '') {
  const c = (nomeCategoria || '').toLowerCase();
  if (c.includes('premium')) return 1.80;        // brigadeiro gourmet premium
  if (c.includes('especial')) return 2.00;       // brigadeiro especial
  return 1.50;                                   // padrão: brigadeiro gourmet
}

/* ---------- BUSCAR PRODUTOS DO BACKEND ---------- */
function fetchCardapio() {
  fetch('/api/produtos/')
    .then(r => r.json())
    .then(renderCardapio)
    .catch(err => console.error('Erro ao buscar produtos:', err));
}

/* ---------- RENDERIZAR CARDÁPIO ---------- */
function renderCardapio(produtos) {
  const grid = document.querySelector('.produto-grid');
  if (!grid) return;
  grid.innerHTML = '';

  produtos.forEach(produto => {
    const categoriaNome = produto.categoria?.nome || '';
    const priceUnit = precoPorCategoria(categoriaNome);

    const card = document.createElement('div');
    card.className = 'produto-card';
    card.dataset.name = produto.nome;
    card.dataset.category = categoriaNome;
    card.dataset.priceunit = String(priceUnit);

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p><small>${categoriaNome}</small></p>
      <p><strong>R$ ${priceUnit.toFixed(2)} por unidade</strong></p>
      <button class="adicionar-carrinho">Adicionar ao Carrinho</button>
    `;
    grid.appendChild(card);
  });

  // Clique: adiciona 1 unidade (mín. 25)
  document.querySelectorAll('.adicionar-carrinho').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.produto-card');
      const name = card.dataset.name;
      const category = card.dataset.category;
      const priceUnit = Number(card.dataset.priceunit);

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let item = cart.find(p => p.name === name && p.category === category);

      if (item) {
        item.quantity += 1; // +1 por clique
      } else {
        item = { name, category, priceUnit, quantity: 25 }; // mínimo inicial
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} adicionado! Quantidade: ${item.quantity}`);
    });
  });
}

/* ---------- CARRINHO ---------- */

function carregarCarrinho(cardItensContainer, cardTotalValue, checkoutBtn) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  if (cart.length > 0) {
    cardItensContainer.innerHTML = "";

    cart.forEach((product, index) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');

      // Preço unitário por categoria
      const tabelaPrecos = {
        "Brigadeiro gourmet": 1.50,
        "Brigadeiro gourmet premium": 1.80,
        "Brigadeiro especial": 2.00
      };

      // Pega preço da categoria ou usa padrão
      const precoUnitario = tabelaPrecos[product.category] || 1.50;
      const subtotal = precoUnitario * (product.quantity || 25);
      total += subtotal;

      cartItem.innerHTML = `
        <span>${product.name}</span>
        <div class="quantidade-controle">
          <button class="menos">-</button>
          <input type="number" min="25" value="${product.quantity || 25}">
          <button class="mais">+</button>
        </div>
        <div class="preco-container">
          <span class="preco">R$ ${subtotal.toFixed(2)}</span>
          <button class="remove-item" title="Remover item">
            <img src="/static/src/lata-de-lixo.png" alt="Remover" class="icon-trash">
          </button>

        </div>
      `;

      // Ações de quantidade
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

  function atualizarTotal() {
    const novoCart = JSON.parse(localStorage.getItem('cart')) || [];
    let novoTotal = 0;

    novoCart.forEach(prod => {
      const tabelaPrecos = {
        "Brigadeiro gourmet": 1.50,
        "Brigadeiro gourmet premium": 1.80,
        "Brigadeiro especial": 2.00
      };
      const preco = tabelaPrecos[prod.category] || 1.50;
      novoTotal += preco * (prod.quantity || 25);
    });

    cardTotalValue.textContent = `R$ ${novoTotal.toFixed(2)}`;
  }

  // Finalizar via WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const numeroWhatsApp = '5515981453091';
      let mensagem = 'Olá! Segue meu pedido:\n\n';
      cart.forEach(product => {
        const tabelaPrecos = {
          "Brigadeiro gourmet": 1.50,
          "Brigadeiro gourmet premium": 1.80,
          "Brigadeiro especial": 2.00
        };
        const preco = tabelaPrecos[product.category] || 1.50;
        mensagem += `- ${product.name} (${product.category}): ${product.quantity || 25} unid. = R$ ${(preco * (product.quantity || 25)).toFixed(2)}\n`;
      });
      mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, '_blank');
      localStorage.removeItem('cart');
    });
  }
}


function salvar(container, totalEl, checkoutBtn, cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  atualizarCarrinho(container, totalEl, checkoutBtn, cart);
}
