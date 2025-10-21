document.addEventListener('DOMContentLoaded', () => {
  console.log("Página carregada:", window.location.pathname);

  // --- CARDÁPIO ---
  if (document.querySelector('.produto-grid')) {
    fetchCardapio();
  }

  // --- CARRINHO ---
  const cardItensContainer = document.getElementById('card-itens-container');
  if (cardItensContainer) {
    console.log("Renderizando carrinho...");
    const cardTotalValue = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(cardItensContainer, cardTotalValue, checkoutBtn);
  }

  // --- LIMPAR CARRINHO ---
  const limparTabela = document.getElementById('limpar-pedido');
  if (limparTabela) {
    limparTabela.addEventListener('click', () => {
      localStorage.removeItem('cart');
      location.reload(true);
    });
  }
});

// 🔹 BUSCA PRODUTOS DO BANCO
function fetchCardapio() {
  fetch("/api/produtos/")
    .then(res => res.json())
    .then(data => renderCardapio(data))
    .catch(err => console.error("Erro ao buscar o produto:", err));
}

// 🔹 RENDERIZA PRODUTOS
function renderCardapio(produtos) {
  const mainSection = document.querySelector('.produto-grid');
  if (!mainSection) return;

  mainSection.innerHTML = '';

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.dataset.name = produto.nome;
    card.dataset.price = produto.preco;

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao || ''}</p>
      <p><strong>R$ ${parseFloat(produto.preco).toFixed(2)}</strong></p>
      <button class="adicionar-carrinho">Adicionar ao Carrinho</button>
    `;
    mainSection.appendChild(card);
  });

  addCarrinho();
}

// 🔹 ADICIONA AO CARRINHO
function addCarrinho() {
  const addTocartButtons = document.querySelectorAll('.adicionar-carrinho');
  addTocartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.produto-card');
      const productName = card.dataset.name;
      const productPrice = parseFloat(card.dataset.price);
      const product = { name: productName, price: productPrice };

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${productName} foi adicionado ao carrinho!`);
    });
  });
}

// 🔹 CARREGA CARRINHO
function carregarCarrinho(cardItensContainer, cardTotalValue, checkoutBtn) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  if (cart.length > 0) {
    cardItensContainer.innerHTML = "";
    cart.forEach(product => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <span>${product.name}</span>
        <span>R$ ${product.price.toFixed(2)}</span>
      `;
      cardItensContainer.appendChild(cartItem);
      total += product.price;
    });
  } else {
    cardItensContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }

  cardTotalValue.textContent = `R$ ${total.toFixed(2)}`;

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const numeroWhatsApp = '5515981453091';
      let mensagem = 'Olá! Segue meu pedido:\n\n';
      cart.forEach(product => {
        mensagem += `- ${product.name}: R$ ${product.price.toFixed(2)}\n`;
      });
      mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, '_blank');
      localStorage.removeItem('cart');
    });
  }
}
