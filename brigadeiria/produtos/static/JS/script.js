document.addEventListener('DOMContentLoaded', () => {

  const itensEl = document.getElementById('card-itens-container');
  if (itensEl) {
    const totalEl = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(itensEl, totalEl, checkoutBtn);
  }

  // Limpar carrinho
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
  if (c.includes('premium')) return 1.80;  // brigadeiro gourmet premium
  if (c.includes('especial')) return 2.00; // brigadeiro especial
  return 1.50;                             // padrão: brigadeiro gourmet
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
      <button 
        class="ver-descricao"
        data-nome="${produto.nome}"
        data-descricao="${produto.descricao || 'Descrição não disponível.'}">
        Ver descrição
      </button>
    `;
    grid.appendChild(card);
  });

  // Reativar eventos de descrição
  document.querySelectorAll('.ver-descricao').forEach(btn => {
    btn.addEventListener('click', () => {
      const nomeProduto = btn.dataset.nome;
      const descricaoProduto = btn.dataset.descricao;
      mostrarDescricao(nomeProduto, descricaoProduto);
    });
  });
}


/* ---------- CARRINHO ---------- */
function carregarCarrinho(container, totalEl, checkoutBtn) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  if (cart.length > 0) {
    container.innerHTML = '';

    cart.forEach((product, index) => {
      const precoUnitario = precoPorCategoria(product.category);
      const subtotal = precoUnitario * (product.quantity || 25);
      total += subtotal;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
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
      container.appendChild(cartItem);

      const input = cartItem.querySelector('input');
      const menos = cartItem.querySelector('.menos');
      const mais = cartItem.querySelector('.mais');
      const precoEl = cartItem.querySelector('.preco');
      const removeBtn = cartItem.querySelector('.remove-item');

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

      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        carregarCarrinho(container, totalEl, checkoutBtn);
      });
    });
  } else {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
  }

  atualizarTotal();

  function atualizarTotal() {
    const novoCart = JSON.parse(localStorage.getItem('cart')) || [];
    let novoTotal = 0;
    novoCart.forEach(prod => {
      const preco = precoPorCategoria(prod.category);
      novoTotal += preco * (prod.quantity || 25);
    });
    totalEl.textContent = `R$ ${novoTotal.toFixed(2)}`;
  }

  // Finalizar via WhatsApp
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      const numeroWhatsApp = '5515981453091';
      let mensagem = 'Olá! Segue meu pedido:\n\n';
      cart.forEach(prod => {
        const preco = precoPorCategoria(prod.category);
        mensagem += `- ${prod.name} (${prod.category}): ${prod.quantity || 25} unid. = R$ ${(preco * (prod.quantity || 25)).toFixed(2)}\n`;
      });
      mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
      localStorage.removeItem('cart');
    };
  }
}
