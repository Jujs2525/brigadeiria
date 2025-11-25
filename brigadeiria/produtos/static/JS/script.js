document.addEventListener('DOMContentLoaded', async () => {

  // Função para verificar se o usuário está logado
  async function verificarLogin() {
    try {
      const resp = await fetch('/verificar-login/');
      const data = await resp.json();
      return data.autenticado;
    } catch {
      return false;
    }
  }

  // Função para salvar o carrinho no servidor
  async function salvarCarrinhoNoServidor() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) return;

      // Envia o carrinho para o backend
      await fetch('/api/carrinho/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
      console.log('Carrinho sincronizado com o servidor');
    } catch (err) {
      console.error('Erro ao salvar carrinho no servidor:', err);
    }
  }

  // Função para carregar o carrinho do servidor
  async function carregarCarrinhoDoServidor() {
    try {
      const resp = await fetch('/api/carrinho/');
      if (resp.ok) {
        const data = await resp.json();
        // Se houver dados no servidor, salve no localStorage
        if (data.length > 0) {
          localStorage.setItem('cart', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.error('Erro ao carregar carrinho do servidor:', err);
    }
  }

  // Função principal: verifica login e sincroniza o carrinho
  const logado = await verificarLogin();

  if (logado) {
    // Se o usuário estiver logado
    if (!localStorage.getItem('cart') || JSON.parse(localStorage.getItem('cart')).length === 0) {
      // Se o carrinho estiver vazio no localStorage, carrega do servidor
      await carregarCarrinhoDoServidor();
    } else {
      // Se o carrinho tiver itens no localStorage, sincronize com o servidor
      await salvarCarrinhoNoServidor();
    }
  } else {
    // Se o usuário não estiver logado, mantém o carrinho apenas no localStorage
    console.log("Usuário não logado — mantendo carrinho apenas no localStorage");
  }

  // Função para carregar o carrinho na página
  const itensEl = document.getElementById('card-itens-container');
  if (itensEl) {
    const totalEl = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    carregarCarrinho(itensEl, totalEl, checkoutBtn);
  }

  // Função para limpar o carrinho manualmente
  const limparBtn = document.getElementById('limpar-pedido');
  if (limparBtn) {
    limparBtn.addEventListener('click', () => {
      localStorage.removeItem('cart');
      location.reload();
    });
  }

  // Finalizar via WhatsApp (somente se o usuário estiver logado)
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = async () => {
      const logado = await verificarLogin();  // Verifica se o usuário está logado

      if (!logado) {
        // Se o usuário não estiver logado, avisa ou redireciona
        alert("Você precisa estar logado para finalizar o pedido.");
        window.location.href = '/logar/';  // Redireciona para a página de login (ajuste conforme sua rota de login)
        return;  // Impede o envio do pedido via WhatsApp
      }

      // Se o usuário estiver logado, prossegue com o envio via WhatsApp
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      let total = 0;
      let mensagem = 'Olá! Segue meu pedido:\n\n';

      // Criar a mensagem do pedido com os itens
      cart.forEach(prod => {
        const preco = precoPorCategoria(prod.category);
        const subtotal = preco * (prod.quantity || 25);
        total += subtotal;
        mensagem += `- ${prod.name} (${prod.category}): ${prod.quantity || 25} unid. = R$ ${subtotal.toFixed(2)}\n`;
      });

      mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;  // Total do pedido

      const url = `https://wa.me/5515981453091?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');  // Abre o WhatsApp com a mensagem do pedido
      localStorage.removeItem('cart');  // Limpar o carrinho local após finalizar a compra
    };
  }
});

// Função para calcular o preço por categoria
function precoPorCategoria(nomeCategoria = '') {
  const c = (nomeCategoria || '').toLowerCase();
  if (c.includes('premium')) return 1.80;  // Exemplo: preço para brigadeiro gourmet premium
  if (c.includes('especial')) return 2.00; // Exemplo: preço para brigadeiro especial
  return 1.50;                             // Exemplo: preço padrão
}

// Função para carregar carrinho no frontend
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

      // Função para atualizar preço e salvar
      const atualizarPreco = () => {
        const qtd = Math.max(25, parseInt(input.value) || 25);
        product.quantity = qtd;
        const novoSubtotal = precoUnitario * qtd;
        precoEl.textContent = `R$ ${novoSubtotal.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        atualizarTotal();
        salvarCarrinhoNoServidor();
      };

      menos.addEventListener('click', () => {
        const qtdAtual = parseInt(input.value) || 25;
        if (qtdAtual > 25) {
          input.value = qtdAtual - 1;
          atualizarPreco();
        }
      });

      input.addEventListener('change', () => {
        if (parseInt(input.value) < 25) {
          input.value = 25;
        }
        atualizarPreco();
      });

      // Remover item do carrinho
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
}
