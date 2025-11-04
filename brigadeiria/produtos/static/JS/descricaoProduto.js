function mostrarDescricao(nome, descricao) {
  const safeName = nome.toLowerCase()
  .replace(/\s+/g, '-')
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\-]/g, "");

  const descricaoDiv = document.getElementById(`${safeName}-descricao`);
  
  if (!descricaoDiv) {
    console.error(`Elemento ${safeName}-descricao não encontrado`);
    return;
  }

  const p = descricaoDiv.querySelector('p');
  if (p) p.textContent = descricao;

  descricaoDiv.classList.add('show');
  descricaoDiv.style.display = 'flex';

  descricaoDiv.addEventListener('click', (e) => {
    const dentroDoCard = e.target.closest('.descricao-content');
    if (!dentroDoCard) fecharDescricao(safeName);
  });
}

function fecharDescricao(nome) {
  const descricaoDiv = document.getElementById(`${nome}-descricao`);
  if (descricaoDiv) {
    descricaoDiv.classList.remove('show');
    setTimeout(() => {
      descricaoDiv.style.display = 'none';
    }, 250);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabelaPrecos = {
    "brigadeiro gourmet": 1.50,
    "brigadeiro gourmet premium": 1.80,
    "brigadeiro especial": 2.00
  };

  // Limpa listeners antigos
  document.querySelectorAll('.ver-descricao, .adicionar-carrinho').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });

  const botoesDescricao = document.querySelectorAll('.ver-descricao');
  const botoesCarrinho = document.querySelectorAll('.adicionar-carrinho');

  // Mostrar descrição
  botoesDescricao.forEach(btn => {
    btn.addEventListener('click', () => {
      const nomeProduto = btn.dataset.nome;
      const descricaoProduto = btn.dataset.descricao;
      mostrarDescricao(nomeProduto, descricaoProduto);
    });
  });

  // Adicionar ao carrinho
  botoesCarrinho.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name.trim();
      const category = (btn.dataset.category || '').toLowerCase().trim();
      const precoBase = tabelaPrecos[category] || 1.50;
      const qtdInput = btn.parentElement.querySelector('input');
      const qtd = parseInt(qtdInput.value) || 25;
      const subtotal = precoBase * qtd;

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const normalizedName = name.toLowerCase().trim();
      const normalizedCategory = category.toLowerCase().trim();

      let item = cart.find(
        p => p.name.toLowerCase().trim() === normalizedName &&
             p.category.toLowerCase().trim() === normalizedCategory
      );

      if (item) {
        item.quantity = qtd;
        alert(`${name} atualizado! Quantidade: ${qtd}`);
      } else {
        item = { name, category, priceUnit: precoBase, quantity: qtd };
        cart.push(item);
        alert(`${qtd} unidades de ${name} (${category}) adicionadas — Total R$ ${subtotal.toFixed(2)}`);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    });
  });

  // === Incremento e decremento ===
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mais') || e.target.classList.contains('menos')) {
      e.stopPropagation(); // evita fechar o modal

      const input = e.target.parentElement.querySelector('input');
      let valorAtual = parseInt(input.value) || 25;

      if (e.target.classList.contains('mais')) {
        valorAtual += 1; 
      } else if (e.target.classList.contains('menos')) {
        valorAtual = Math.max(25, valorAtual - 1); // mínimo 25
      }

      input.value = valorAtual;
    }
  });
});

console.log('JS de descrição carregado com incremento/decremento funcionando');
