document.addEventListener('DOMContentLoaded', async () => {

  async function verificarLogin() {
    try {
      const resp = await fetch('/verificar-login/');
      const data = await resp.json();
      return data.autenticado;
    } catch {
      return false;
    }
  }

  /* ---------- SALVAR CARRINHO NO SERVIDOR ---------- */
  async function salvarCarrinhoNoServidor() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) return;

      await fetch('/api/carrinho/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
    } catch (err) {
      console.error('Erro ao salvar carrinho no servidor:', err);
    }
  }

  // CARREGAR CARRINHO DO SERVIDOR SE ESTIVER LOGADO
  const logado = await verificarLogin();

  if (logado) {
    // 🔹 Usuário logado
    if (!localStorage.getItem('cart') || JSON.parse(localStorage.getItem('cart')).length === 0) {
      await carregarCarrinhoDoServidor(); // carrega do servidor se local estiver vazio
    } else {
      await salvarCarrinhoNoServidor(); // sincroniza o carrinho local com o servidor
    }
  } else {
    // 🔹 Visitante (não logado)
    console.log("Usuário não logado — mantendo carrinho apenas no localStorage");
  }


  // CARREGAR CARRINHO SE EXISTIR
  const itensEl = document.getElementById('card-itens-container');
  if (itensEl) {
    const totalEl = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(itensEl, totalEl, checkoutBtn);
  }

  // BOTÃO DE LIMPAR MANUALMENTE
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

/* ---------- SINCRONIZAR CARRINHO DO SERVIDOR ---------- */
async function carregarCarrinhoDoServidor() {
  try {
    const resp = await fetch('/api/carrinho/');
    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem('cart', JSON.stringify(data));
    }
  } catch (err) {
    console.error('Erro ao carregar carrinho do servidor:', err);
  }
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

      // === Função para atualizar preço e salvar ===
      const atualizarPreco = () => {
        const qtd = Math.max(25, parseInt(input.value) || 25);
        product.quantity = qtd;
        const novoSubtotal = precoUnitario * qtd;
        precoEl.textContent = `R$ ${novoSubtotal.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        atualizarTotal();
        salvarCarrinhoNoServidor();
      };

      // === Função de aviso de pedido mínimo ===
      function mostrarAviso(msg, botaoOuInput) {
        const card = botaoOuInput.closest(".cart-item") || document.body;
        const quantidadeBox = card.querySelector(".quantidade-controle");

        let aviso = card.querySelector(".aviso-minimo");
        if (!aviso) {
          aviso = document.createElement("div");
          aviso.className = "aviso-minimo";
          
          card.appendChild(aviso);
        }

        aviso.textContent = msg;
        aviso.style.display = "block";

        clearTimeout(aviso.timeout);
        aviso.timeout = setTimeout(() => {
          aviso.style.display = "none";
        }, 2500);
      }




      // === Botão de diminuir quantidade ===
      menos.addEventListener('click', () => {
        const qtdAtual = parseInt(input.value) || 25;
        if (qtdAtual > 25) {
          input.value = qtdAtual - 1;
          atualizarPreco();
        } else {
          mostrarAviso("O pedido mínimo é de 25 unidades.", menos);
        }
      });

      input.addEventListener('change', () => {
        if (parseInt(input.value) < 25) {
          input.value = 25;
          mostrarAviso("O pedido mínimo é de 25 unidades.", input);
        }
        atualizarPreco();
      });


      // === Remover item do carrinho ===
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        carregarCarrinho(container, totalEl, checkoutBtn);
        salvarCarrinhoNoServidor();
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
    total = novoTotal;
  }

  // Finalizar via WhatsApp (verifica login de verdade)
  if (checkoutBtn) {
    checkoutBtn.onclick = async () => {
      try {
        const resp = await fetch('/verificar-login/');
        const data = await resp.json();

        // Se não estiver logado → bloqueia e redireciona
        if (!data.autenticado) {
          const modal = document.getElementById("loginModal");
          if (modal) modal.classList.add("show");

          const closeBtn = document.getElementById("closeModal");
          if (closeBtn) {
            closeBtn.addEventListener("click", () => {
              modal.classList.remove("show");
            });
          }
          return;
        }


        // --- Se estiver logado ---
        const numeroWhatsApp = '5515981453091';
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        let mensagem = 'Olá! Segue meu pedido:\n\n';

        cart.forEach(prod => {
          const preco = precoPorCategoria(prod.category);
          const subtotal = preco * (prod.quantity || 25);
          total += subtotal;
          mensagem += `- ${prod.name} (${prod.category}): ${prod.quantity || 25} unid. = R$ ${subtotal.toFixed(2)}\n`;
        });

        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        localStorage.removeItem('cart');
      } catch (err) {
        console.error('Erro ao verificar login:', err);
        alert('Ocorreu um erro ao finalizar. Tente novamente.');
      }
    };
  }
}
